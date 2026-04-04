import httpx

from app.core.config import settings
from app.schemas.chat import ChatTurn
from app.services.nlp_service import nlp_service


SYSTEM_PROMPT = """
You are Ku Mind, a Thai-first supportive mental wellness chat assistant for general emotional support.

Rules:
- Respond in Thai by default unless the user clearly writes in another language.
- Be warm, calm, concise, and non-judgmental.
- Help the user reflect, organize thoughts, and take small practical next steps.
- Respond specifically about what the user is sharing. Avoid generic responses that could fit any input.
- Ask at most one helpful follow-up question and keep it grounded in user text.
- Do not claim to be a licensed therapist, psychologist, or doctor.
- Do not diagnose mental illnesses.
- Do not provide medication, legal, or emergency instructions beyond encouraging professional help.
- If the user mentions self-harm, suicide, harming others, or immediate danger, respond with empathy, clearly encourage contacting local emergency services or a trusted person right now, and suggest reaching a crisis hotline. Keep it supportive and direct.
- Prefer short paragraphs.
""".strip()


class ChatService:
    def _analyze_message_context(self, message: str) -> dict:
        """
        วิเคราะห์ข้อความด้วย NLP เพื่อปรับ response ให้เหมาะสม
        """
        try:
            analysis = nlp_service.analyze_message(message)
            return {
                "sentiment": analysis["sentiment"]["label"],
                "emotion": analysis["emotion"]["primary_emotion"],
                "themes": analysis["themes"],
                "nlp_risk": analysis["nlp_risk_score"]
            }
        except Exception as e:
            # Fallback if NLP fails
            return {
                "sentiment": "NEUTRAL",
                "emotion": "neutral",
                "themes": [],
                "nlp_risk": 0.0
            }

    def _build_enhanced_system_prompt(self, message: str, context: dict) -> str:
        """
        สร้าง system prompt ที่ปรับตาม NLP analysis
        """
        base_prompt = SYSTEM_PROMPT

        # เพิ่มการสะท้อนข้อความผู้ใช้และ maaktit specific
        enhancements = [
            f"User message: {message}",
            "In your reply, start with an empathetic reflection of the user text using their own keywords.",
            "Then provide a concrete, practical response with 2-3 short action steps.",
            "Avoid only generic phrases like 'ฉันรับฟัง' โดยไม่มีเนื้อหาเจาะจง.",
        ]

        if context["sentiment"] == "NEGATIVE":
            enhancements.append("The user seems to be expressing negative feelings. Respond with extra empathy and validation.")

        if context["emotion"] in ["sadness", "anger", "fear"]:
            enhancements.append("The user appears to be experiencing difficult emotions. Focus on emotional validation and gentle support.")

        if "stress" in context["themes"]:
            enhancements.append("The user is mentioning stress-related topics. Suggest practical stress management techniques.")

        if "work" in context["themes"] or "deadline" in context["themes"]:
            enhancements.append("The user is discussing work or academic pressure. Help them break down tasks and manage time.")

        if "sleep" in context["themes"]:
            enhancements.append("The user is talking about sleep issues. Suggest healthy sleep habits and routines.")

        # คำขอแผนดูแลใจให้ไม่หลุด
        if any(keyword in message.lower() for keyword in ["แผนดูแลใจ", "plan", "routine", "คืนนี้"]):
            enhancements.append("The user asked for a simple wellness plan. Provide a clear three-step nighttime self-care plan.")

        if context["nlp_risk"] > 0.6:
            enhancements.append("The user may be experiencing higher levels of distress. Be particularly supportive and suggest professional resources if appropriate.")

        if enhancements:
            enhanced_prompt = base_prompt + "\n\nAdditional Context:\n" + "\n".join(f"- {enh}" for enh in enhancements)
            return enhanced_prompt

        return base_prompt
    async def reply(self, message: str, history: list[ChatTurn] | None = None) -> str:
        # วิเคราะห์ข้อความด้วย NLP
        nlp_context = self._analyze_message_context(message)

        # สร้าง enhanced system prompt
        enhanced_system_prompt = self._build_enhanced_system_prompt(message, nlp_context)

        # ถ้าไม่มี Gemini API ให้ fallback response จาก local heuristic
        if not settings.gemini_api_key:
            return (
                f"ขอโทษนะคะ ขณะนี้ระบบ Gemini ยังไม่เปิดใช้งาน แต่ฉันเข้าใจว่า\n"
                f"คุณพูดว่า: \"{message}\"\n"
                "ลองเริ่มจากแยกความรู้สึกออกเป็น 2-3 จุด แล้วฉันช่วยคุณจัดลำดับได้"
            )

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.gemini_model}:generateContent"
        )
        payload = {
            "system_instruction": {
                "parts": [{"text": enhanced_system_prompt}],
            },
            "contents": self._build_contents(message, history or []),
            "generationConfig": {
                "temperature": 0.7,
                "topP": 0.9,
                "maxOutputTokens": 2048,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(
                    url,
                    params={"key": settings.gemini_api_key},
                    json=payload,
                    headers={"Content-Type": "application/json"},
                )
            print("STATUS:", response.status_code)
            print("BODY:", response.text)
            response.raise_for_status()
            data = response.json()
            reply_text = self._extract_text(data)
            # ถ้า Gemini คืนคำตอบสั้นเกินไป, ให้เติมด้วยข้อมูล context เล็กน้อย
            if len(reply_text.strip()) < 20:
                fallback = (
                    f"ฉันเข้าใจว่าคุณพูดว่า: {message}. "
                    "ขอแนะนำให้ลองเริ่มจากสำรวจว่าอารมณ์ตอนนี้เป็นอย่างไร แล้วทำอะไรได้บ้างทันที"
                )
                return fallback
            return reply_text
        except (httpx.HTTPStatusError, httpx.HTTPError) as exc:
            # fallback ด้วยข้อความที่ตรงประเด็นและเชื่อมกับ input
            return (
                f"ขอโทษค่ะ พบปัญหาเชื่อมต่อ Gemini: {str(exc)}\n"
                f"คุณบอกว่า: '{message}'\n"
                "ฉันยังอยู่ตรงนี้และช่วยได้: ลองเล่าต่อว่าอยากให้ดีขึ้นเรื่องอะไร"
            )

    async def reply_with_context(self, message: str, history: list[ChatTurn] | None = None) -> dict:
        """
        Reply พร้อมส่ง NLP context กลับไปด้วย
        """
        nlp_context = self._analyze_message_context(message)
        reply_text = await self.reply(message, history)

        return {
            "reply": reply_text,
            "nlp_context": nlp_context
        }

    def _extract_text(self, data: dict) -> str:
        candidates = data.get("candidates") or []
        for candidate in candidates:
            content = candidate.get("content") or {}
            parts = content.get("parts") or []
            text_parts = [part.get("text", "").strip() for part in parts if part.get("text")]
            reply = "\n".join(part for part in text_parts if part).strip()
            if reply:
                return reply

        raise ValueError("Gemini returned an empty response.")

    def _build_contents(self, message: str, history: list[ChatTurn]) -> list[dict]:
        contents: list[dict] = []

        for turn in history[-12:]:
            role = "model" if turn.role == "assistant" else "user"
            contents.append({"role": role, "parts": [{"text": turn.content.strip()}]})

        contents.append({"role": "user", "parts": [{"text": message.strip()}]})
        return contents

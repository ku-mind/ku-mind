import asyncio
import logging

import httpx

from app.core.config import settings
from app.schemas.chat import ChatTurn
from app.services.nlp_service import nlp_service
from app.services.risk_service import risk_service


logger = logging.getLogger(__name__)


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
    RETRYABLE_GEMINI_STATUS_CODES = {429, 500, 502, 503, 504}

    def _suggest_session_title(self, message: str, nlp_context: dict, risk_context: dict) -> str:
        text = " ".join(message.strip().split())
        if not text:
            return "บทสนทนาใหม่"

        if risk_context["risk_level"] == "high":
            return "ต้องการความปลอดภัยทันที"

        theme_titles = {
            "work": "จัดการงานและเดดไลน์",
            "stress": "รับมือความเครียด",
            "sleep": "ปัญหาการนอน",
            "loneliness": "ความเหงาและการอยู่ลำพัง",
            "relationship": "ความสัมพันธ์ที่ค้างคา",
            "mood": "สำรวจความรู้สึกข้างใน",
            "finance": "ความกังวลเรื่องการเงิน",
            "health": "ดูแลใจระหว่างไม่สบาย",
        }

        for theme in nlp_context.get("themes", []):
            if theme in theme_titles:
                return theme_titles[theme]

        sanitized = text.replace("\n", " ")
        fillers = [
            "วันนี้",
            "ช่วงนี้",
            "แบบว่า",
            "คือ",
            "หนู",
            "เรา",
            "ฉัน",
            "ผม",
            "ค่ะ",
            "ครับ",
            "นะ",
            "นิดหน่อย",
        ]
        for filler in fillers:
            sanitized = sanitized.replace(filler, " ")
        sanitized = " ".join(sanitized.split())
        if not sanitized:
            sanitized = text

        return sanitized[:28].rstrip(" ,.-") or "บทสนทนาใหม่"

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
                "nlp_risk": analysis["nlp_risk_score"],
            }
        except Exception:
            # Fallback if NLP fails
            return {
                "sentiment": "NEUTRAL",
                "emotion": "neutral",
                "themes": [],
                "nlp_risk": 0.0,
            }

    def _build_risk_context(self, message: str, nlp_context: dict) -> dict:
        return risk_service.assess_text(message, nlp_context.get("nlp_risk", 0.0))

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

    def _build_local_support_reply(self, message: str, nlp_context: dict) -> str:
        text = message.strip()
        themes = set(nlp_context.get("themes", []))

        if "sleep" in themes:
            guidance = (
                "คืนนี้ลองเริ่มจากทำให้ร่างกายช้าลงก่อน: วางจอ 20-30 นาที ดื่มน้ำหรืออาบน้ำอุ่น "
                "แล้วจดเรื่องที่ค้างในหัวออกมาเป็นข้อสั้น ๆ"
            )
        elif "work" in themes or "stress" in themes:
            guidance = (
                "ลองแยกสิ่งที่อยู่ในหัวเป็น 3 ช่อง: ต้องทำตอนนี้, เลื่อนได้, และขอความช่วยเหลือได้ "
                "จากนั้นเลือกทำข้อที่เล็กที่สุดก่อน 10 นาที"
            )
        elif "loneliness" in themes or "relationship" in themes:
            guidance = (
                "ความรู้สึกนี้ไม่จำเป็นต้องแบกคนเดียวนะคะ ลองเลือกคนที่ไว้ใจได้หนึ่งคน "
                "แล้วส่งข้อความสั้น ๆ ว่าอยากมีคนรับฟังสักพัก"
            )
        else:
            guidance = (
                "ลองเริ่มจากตั้งชื่อความรู้สึกตอนนี้ 1-2 คำ แล้วดูว่าเรื่องไหนเป็นต้นเหตุหลักที่สุด "
                "เราจะค่อย ๆ จัดมันทีละส่วนได้"
            )

        return (
            "ขอโทษค่ะ ตอนนี้ระบบตอบกลับหลักขัดข้องชั่วคราว แต่ฉันยังช่วยประคองบทสนทนาต่อได้\n\n"
            f"จากที่คุณเล่าว่า: \"{text}\"\n"
            f"{guidance}\n\n"
            "ถ้าอยากเล่าต่อ ตอนนี้ส่วนที่หนักที่สุดคือเรื่องอะไรคะ?"
        )

    async def reply(self, message: str, history: list[ChatTurn] | None = None) -> str:
        result = await self.reply_with_context(message, history)
        return result["reply"]

    async def reply_with_context(self, message: str, history: list[ChatTurn] | None = None) -> dict:
        # วิเคราะห์ข้อความด้วย NLP
        nlp_context = self._analyze_message_context(message)
        risk_context = self._build_risk_context(message, nlp_context)

        if risk_context["requires_crisis_flow"]:
            return {
                "reply": risk_service.build_crisis_response(),
                "nlp_context": nlp_context,
                "risk_assessment": risk_context,
                "response_mode": "crisis_override",
                "title_suggestion": self._suggest_session_title(message, nlp_context, risk_context),
            }

        # สร้าง enhanced system prompt
        enhanced_system_prompt = self._build_enhanced_system_prompt(message, nlp_context)

        # ถ้าไม่มี Gemini API ให้ fallback response จาก local heuristic
        if not settings.gemini_api_key:
            return {
                "reply": (
                    f"ขอโทษนะคะ ขณะนี้ระบบ Gemini ยังไม่เปิดใช้งาน แต่ฉันเข้าใจว่า\n"
                    f"คุณพูดว่า: \"{message}\"\n"
                    "ลองเริ่มจากแยกความรู้สึกออกเป็น 2-3 จุด แล้วฉันช่วยคุณจัดลำดับได้"
                ),
                "nlp_context": nlp_context,
                "risk_assessment": risk_context,
                "response_mode": "local_fallback",
                "title_suggestion": self._suggest_session_title(message, nlp_context, risk_context),
            }

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
                response = await self._post_to_gemini_with_retry(client, url, payload)
            data = response.json()
            reply_text = self._extract_text(data)
            # ถ้า Gemini คืนคำตอบสั้นเกินไป, ให้เติมด้วยข้อมูล context เล็กน้อย
            if len(reply_text.strip()) < 20:
                reply_text = (
                    f"ฉันเข้าใจว่าคุณพูดว่า: {message}. "
                    "ขอแนะนำให้ลองเริ่มจากสำรวจว่าอารมณ์ตอนนี้เป็นอย่างไร แล้วทำอะไรได้บ้างทันที"
                )
            return {
                "reply": reply_text,
                "nlp_context": nlp_context,
                "risk_assessment": risk_context,
                "response_mode": "llm",
                "title_suggestion": self._suggest_session_title(message, nlp_context, risk_context),
            }
        except (ValueError, httpx.HTTPStatusError, httpx.HTTPError) as exc:
            logger.warning("Gemini response failed; using local fallback: %s", exc.__class__.__name__)
            return {
                "reply": self._build_local_support_reply(message, nlp_context),
                "nlp_context": nlp_context,
                "risk_assessment": risk_context,
                "response_mode": "llm_error_fallback",
                "title_suggestion": self._suggest_session_title(message, nlp_context, risk_context),
            }

    async def _post_to_gemini_with_retry(
        self,
        client: httpx.AsyncClient,
        url: str,
        payload: dict,
        max_attempts: int = 3,
    ) -> httpx.Response:
        response: httpx.Response | None = None

        for attempt in range(max_attempts):
            response = await client.post(
                url,
                params={"key": settings.gemini_api_key},
                json=payload,
                headers={"Content-Type": "application/json"},
            )

            if response.status_code not in self.RETRYABLE_GEMINI_STATUS_CODES:
                response.raise_for_status()
                return response

            if attempt < max_attempts - 1:
                await asyncio.sleep(0.6 * (attempt + 1))

        if response is None:
            raise httpx.HTTPError("Gemini request did not return a response.")

        response.raise_for_status()
        return response

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

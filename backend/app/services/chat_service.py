import httpx

from app.core.config import settings
from app.schemas.chat import ChatTurn


SYSTEM_PROMPT = """
You are Ku Mind, a Thai-first supportive mental wellness chat assistant for general emotional support.

Rules:
- Respond in Thai by default unless the user clearly writes in another language.
- Be warm, calm, concise, and non-judgmental.
- Help the user reflect, organize thoughts, and take small practical next steps.
- Do not claim to be a licensed therapist, psychologist, or doctor.
- Do not diagnose mental illnesses.
- Do not provide medication, legal, or emergency instructions beyond encouraging professional help.
- If the user mentions self-harm, suicide, harming others, or immediate danger, respond with empathy, clearly encourage contacting local emergency services or a trusted person right now, and suggest reaching a crisis hotline. Keep it supportive and direct.
- Prefer short paragraphs. Ask at most one helpful follow-up question at a time.
""".strip()


class ChatService:
    async def reply(self, message: str, history: list[ChatTurn] | None = None) -> str:
        if not settings.gemini_api_key:
            raise ValueError("Gemini API is not configured. Set GEMINI_API_KEY in the backend environment.")

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.gemini_model}:generateContent"
        )
        payload = {
            "system_instruction": {
                "parts": [{"text": SYSTEM_PROMPT}],
            },
            "contents": self._build_contents(message, history or []),
            "generationConfig": {
                "temperature": 0.8,
                "topP": 0.9,
                "maxOutputTokens": 700,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    url,
                    params={"key": settings.gemini_api_key},
                    json=payload,
                    headers={"Content-Type": "application/json"},
                )
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPStatusError as exc:
            raise ValueError(f"Gemini API request failed with status {exc.response.status_code}.") from exc
        except httpx.HTTPError as exc:
            raise ValueError("Failed to reach Gemini API from the backend.") from exc

        return self._extract_text(data)

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

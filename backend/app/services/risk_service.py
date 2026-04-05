from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class RiskPattern:
    phrase: str
    weight: float
    reason: str


class RiskService:
    def __init__(self) -> None:
        self._high_risk_patterns = [
            RiskPattern("อยากตาย", 0.95, "explicit_self_harm_intent"),
            RiskPattern("ไม่อยากมีชีวิตอยู่", 0.95, "explicit_self_harm_intent"),
            RiskPattern("ไม่อยากอยู่แล้ว", 0.92, "explicit_self_harm_intent"),
            RiskPattern("ฆ่าตัวตาย", 0.98, "suicide_reference"),
            RiskPattern("จบชีวิต", 0.95, "suicide_reference"),
            RiskPattern("ทำร้ายตัวเอง", 0.92, "self_harm_reference"),
            RiskPattern("กรีดแขน", 0.95, "self_harm_method_reference"),
            RiskPattern("กินยาเกินขนาด", 0.98, "overdose_reference"),
            RiskPattern("ผูกคอ", 0.99, "suicide_method_reference"),
            RiskPattern("กระโดดตึก", 0.99, "suicide_method_reference"),
            RiskPattern("หายไปเลย", 0.88, "disappearance_wish"),
            RiskPattern("i want to die", 0.95, "explicit_self_harm_intent"),
            RiskPattern("kill myself", 0.99, "suicide_reference"),
            RiskPattern("end my life", 0.98, "suicide_reference"),
            RiskPattern("hurt myself", 0.92, "self_harm_reference"),
        ]
        self._medium_risk_patterns = [
            RiskPattern("อยากหายไป", 0.65, "passive_death_wish"),
            RiskPattern("ไม่อยากตื่นขึ้นมา", 0.72, "passive_death_wish"),
            RiskPattern("ไม่อยากอยู่คนเดียว", 0.45, "isolation_vulnerability"),
            RiskPattern("อยู่ต่อไม่ไหว", 0.68, "hopelessness"),
            RiskPattern("หมดแรงจะอยู่", 0.66, "hopelessness"),
            RiskPattern("ไม่ไหวแล้ว", 0.45, "overwhelm"),
            RiskPattern("ชีวิตไม่มีความหมาย", 0.72, "meaninglessness"),
            RiskPattern("อยากหนีไปไกลๆ", 0.42, "escape_wish"),
            RiskPattern("ไม่มีใครช่วยได้", 0.52, "hopelessness"),
            RiskPattern("ไม่เหลือใครแล้ว", 0.56, "social_disconnection"),
            RiskPattern("i want to disappear", 0.65, "passive_death_wish"),
            RiskPattern("can't go on", 0.68, "hopelessness"),
            RiskPattern("no reason to live", 0.78, "meaninglessness"),
        ]

    def assess_text(self, text: str, nlp_risk_score: float = 0.0) -> dict:
        normalized = text.casefold().strip()
        if not normalized:
            return self._build_result("low", 0.0, [], False)

        matched_reasons: list[str] = []
        score = 0.0
        high_confidence = False

        for pattern in self._high_risk_patterns:
            if pattern.phrase in normalized:
                matched_reasons.append(pattern.reason)
                score = max(score, pattern.weight)
                high_confidence = True

        for pattern in self._medium_risk_patterns:
            if pattern.phrase in normalized:
                matched_reasons.append(pattern.reason)
                score = max(score, pattern.weight)

        score = max(score, min(max(nlp_risk_score, 0.0), 1.0) * 0.7)
        level = self._score_to_level(score, high_confidence)
        return self._build_result(level, score, matched_reasons, high_confidence)

    def build_crisis_response(self) -> str:
        return (
            "ขอบคุณที่บอกตรงๆ นะคะ จากข้อความนี้ดูเหมือนว่าตอนนี้คุณอาจไม่ปลอดภัย\n\n"
            "สิ่งสำคัญที่สุดตอนนี้คืออย่าอยู่กับความรู้สึกนี้คนเดียว กรุณาติดต่อคนที่ไว้ใจได้ทันที "
            "เช่น เพื่อน คนในครอบครัว รุ่นพี่ หรือคนที่อยู่ใกล้คุณตอนนี้ และบอกเขาตรงๆ ว่าคุณต้องการให้ช่วยอยู่เป็นเพื่อน\n\n"
            "ถ้าคุณมีความเสี่ยงจะทำร้ายตัวเองในตอนนี้ ให้โทร 1323 สายด่วนสุขภาพจิต หรือโทรฉุกเฉิน 1669 ทันที "
            "ถ้าเป็นไปได้ ให้ย้ายตัวเองไปอยู่ใกล้คนอื่นและเอาของมีคมหรือสิ่งที่อาจใช้ทำร้ายตัวเองออกจากตัวก่อน\n\n"
            "ถ้าคุณโอเค พิมพ์กลับมาได้สั้นๆ แค่ว่า 'มีคนอยู่ด้วยแล้ว' หรือ 'ยังอยู่คนเดียว' ฉันจะช่วยคุยต่อให้สั้นและตรงที่สุดค่ะ"
        )

    def _score_to_level(self, score: float, high_confidence: bool) -> str:
        if high_confidence or score >= 0.85:
            return "high"
        if score >= 0.45:
            return "medium"
        return "low"

    def _build_result(
        self,
        level: str,
        score: float,
        matched_reasons: list[str],
        high_confidence: bool,
    ) -> dict:
        return {
            "risk_level": level,
            "risk_score": round(score, 3),
            "matched_reasons": sorted(set(matched_reasons)),
            "requires_crisis_flow": level == "high",
            "high_confidence": high_confidence,
        }


risk_service = RiskService()

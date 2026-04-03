from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import Literal

from app.api.router import api_router
from app.core.config import settings
from app.db.session import Base, engine
from app.services.nlp_service import nlp_service

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.exception_handler(HTTPException)
def http_exception_handler(_: Request, exc: HTTPException):
    message = exc.detail if isinstance(exc.detail, str) else "Request failed"
    return JSONResponse(status_code=exc.status_code, content={"message": message})


@app.get("/")
def root():
    return {"message": "KU Mind API is running", "health": "/health"}


# @app.get("/health")
# def health():
#     return {"ok": True}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)



# ── Models ──────────────────────────────────────────────────────────────────
 
class CheckInData(BaseModel):
    workload: int = Field(..., ge=1, le=10, description="ภาระงาน/เดดไลน์ (1-10)")
    sleep_hours: float = Field(..., ge=0, le=12, description="ชั่วโมงนอน")
    fatigue: int = Field(..., ge=1, le=10, description="ระดับความเหนื่อยล้า (1-10)")
    social_pressure: int = Field(..., ge=1, le=10, description="ความกดดันทางสังคม (1-10)")
    deadline_count: int = Field(..., ge=0, le=20, description="จำนวนเดดไลน์ภายใน 1 สัปดาห์")
    mood: int = Field(..., ge=1, le=10, description="อารมณ์โดยรวมวันนี้ (1=แย่มาก, 10=ดีมาก)")

class CheckInWithTextData(CheckInData):
    additional_text: str = Field("", description="ข้อความเพิ่มเติม (optional)")
 
class RiskResult(BaseModel):
    risk_level: Literal["low", "medium", "high"]
    risk_score: float
    score_breakdown: dict
    recommendations: list[str]
    referral_options: list[dict]
    summary: str
 
# ── Scoring Engine ───────────────────────────────────────────────────────────
 
def compute_risk_score(data: CheckInData) -> dict:
 
    # Normalize sleep: 7-8 ชั่วโมง = optimal (score 0), น้อยหรือมากเกินไป = risk สูงขึ้น
    sleep_deviation = abs(data.sleep_hours - 7.5) / 7.5  # 0 = perfect, 1 = max risk
    sleep_score = min(sleep_deviation, 1.0)
 
    # Normalize workload (1-10 → 0-1, สูง = risk สูง)
    workload_score = (data.workload - 1) / 9
 
    # Normalize fatigue (1-10 → 0-1, สูง = risk สูง)
    fatigue_score = (data.fatigue - 1) / 9
 
    # Normalize social pressure (1-10 → 0-1)
    social_score = (data.social_pressure - 1) / 9
 
    # Normalize deadline count (0-20 → 0-1)
    deadline_score = min(data.deadline_count / 10, 1.0)
 
    # Mood score: ต่ำ = risk สูง (invert)
    mood_score = 1 - (data.mood - 1) / 9
 
    # Weighted sum — weights ออกแบบตามหลัก behavioral economics
    weights = {
        "workload": 0.25,
        "sleep": 0.20,
        "fatigue": 0.20,
        "mood": 0.15,
        "social": 0.12,
        "deadline": 0.08,
    }
 
    final_score = (
        weights["workload"] * workload_score +
        weights["sleep"] * sleep_score +
        weights["fatigue"] * fatigue_score +
        weights["mood"] * mood_score +
        weights["social"] * social_score +
        weights["deadline"] * deadline_score
    )
 
    breakdown = {
        "workload": round(workload_score * 100),
        "sleep": round(sleep_score * 100),
        "fatigue": round(fatigue_score * 100),
        "mood": round(mood_score * 100),
        "social_pressure": round(social_score * 100),
        "deadlines": round(deadline_score * 100),
    }

    return {
        "score": round(final_score, 3),
        "breakdown": breakdown
    }


def compute_combined_risk_score(data: CheckInData, additional_text: str = "") -> dict:
    # คำนวณจาก check-in data
    checkin_result = compute_risk_score(data)
    checkin_score = checkin_result["score"]

    # คำนวณจาก NLP ถ้ามีข้อความเพิ่มเติม
    nlp_score = 0.0
    nlp_analysis = None

    if additional_text.strip():
        try:
            nlp_analysis = nlp_service.analyze_message(additional_text)
            nlp_score = nlp_analysis["nlp_risk_score"]
        except Exception as e:
            # Fallback if NLP fails
            nlp_score = 0.0

    # รวมคะแนน (weighted average)
    if nlp_analysis:
        # ถ้ามี NLP ให้ weight เท่ากัน
        combined_score = (checkin_score * 0.7) + (nlp_score * 0.3)
        weights = {"checkin": 0.7, "nlp": 0.3}
    else:
        # ถ้าไม่มี NLP ให้ใช้ check-in เท่านั้น
        combined_score = checkin_score
        weights = {"checkin": 1.0, "nlp": 0.0}

    return {
        "combined_score": round(combined_score, 3),
        "checkin_score": checkin_score,
        "nlp_score": nlp_score,
        "weights": weights,
        "nlp_analysis": nlp_analysis,
        "breakdown": checkin_result["breakdown"]
    }
 
 
def get_risk_level(score: float) -> Literal["low", "medium", "high"]:
    if score < 0.35:
        return "low"
    elif score < 0.65:
        return "medium"
    else:
        return "high"
 
 
def get_recommendations(level: str, data: CheckInData) -> list[str]:
    base = {
        "low": [
            "คุณดูอยู่ในเกณฑ์ดี ลองรักษา routine การนอนและการพักผ่อนต่อไป",
            "ลองทำ Pomodoro Technique เพื่อจัดการ workload อย่างมีระบบ",
            "กิจกรรมเบาๆ เช่น เดินเล่น ฟังเพลง หรือพูดคุยกับเพื่อน ช่วยรักษาสมดุลได้",
        ],
        "medium": [
            "พักสมองทุก 45-60 นาที หรือแม้แค่ 5-10 นาที ก็ช่วยลดความเหนื่อยล้าได้",
            "ลองเขียนรายการสิ่งที่ต้องทำ และจัดลำดับความสำคัญ แทนการพยายามทำทุกอย่างพร้อมกัน",
            "การนอนหลับให้ครบ 7-8 ชั่วโมง มีผลต่อการจัดการความเครียดโดยตรง",
            "พูดคุยกับเพื่อนหรือคนใกล้ชิดเกี่ยวกับสิ่งที่กังวล",
        ],
        "high": [
            "หยุดพักก่อน — การฝืนทำงานในสภาวะนี้มักทำให้ประสิทธิภาพลดลงมากกว่าเพิ่มขึ้น",
            "ลองหายใจลึกๆ หรือ box breathing (หายใจเข้า 4 วินาที หายใจออก 4 วินาที) เพื่อลดความกดดัน",
            "ติดต่อขอความช่วยเหลือจากคนที่ไว้ใจได้ ไม่ว่าจะเป็นเพื่อน รุ่นพี่ หรืออาจารย์",
            "พิจารณาเข้าพบที่ศูนย์ให้คำปรึกษา — การพูดคุยกับผู้เชี่ยวชาญไม่ได้หมายความว่าคุณ 'แพ้'",
        ],
    }
 
    recs = list(base[level])
 
    # Personalized additions
    if data.sleep_hours < 5:
        recs.insert(0, "ชั่วโมงนอนของคุณต่ำมาก — ลองตั้งเป้าเพิ่มการนอนเป็น 6-7 ชั่วโมงในคืนนี้ก่อนเลย")
    if data.deadline_count >= 5:
        recs.append("มีเดดไลน์หลายอย่างพร้อมกัน — ลองคุยกับอาจารย์หรือรุ่นพี่เพื่อช่วยจัดลำดับความสำคัญ")
 
    return recs[:5]  # คืนแค่ 5 ข้อ ไม่ให้ท่วม
 
 
def get_referral_options(level: str) -> list[dict]:
    all_options = [
        {
            "type": "self",
            "label": "ดูแลตัวเอง",
            "description": "เทคนิคและแหล่งข้อมูลที่ทำได้เอง",
            "show_for": ["low", "medium", "high"],
        },
        {
            "type": "peer",
            "label": "เพื่อนหรือรุ่นพี่",
            "description": "พูดคุยกับคนที่ไว้ใจในมหาวิทยาลัย",
            "show_for": ["low", "medium", "high"],
        },
        {
            "type": "advisor",
            "label": "อาจารย์ที่ปรึกษา",
            "description": "ขอคำแนะนำด้านการเรียนและชีวิตนักศึกษา",
            "show_for": ["medium", "high"],
        },
        {
            "type": "counseling",
            "label": "ศูนย์ให้คำปรึกษา มก.",
            "description": "บริการฟรีสำหรับนิสิต — ไม่ระบุตัวตนได้",
            "contact": "02-942-8200 ต่อ 614614",
            "show_for": ["medium", "high"],
        },
        {
            "type": "crisis",
            "label": "สายด่วนสุขภาพจิต",
            "description": "พร้อมให้บริการ 24 ชั่วโมง",
            "contact": "1323",
            "show_for": ["high"],
        },
    ]
    return [opt for opt in all_options if level in opt["show_for"]]
 
 
def build_summary(level: str, score: float, data: CheckInData) -> str:
    level_th = {"low": "ต่ำ", "medium": "ปานกลาง", "high": "สูง"}[level]
    return (
        f"ระดับความเสี่ยงของคุณอยู่ในระดับ{level_th} (คะแนน {round(score * 100)}/100) "
        f"จากข้อมูล check-in วันนี้ นี่คือการประเมินเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัย"
    )
 
 
# ── Routes ───────────────────────────────────────────────────────────────────

@app.post("/api/checkin", response_model=RiskResult)
def submit_checkin(data: CheckInData):
    result = compute_risk_score(data)
    score = result["score"]
    level = get_risk_level(score)

    return RiskResult(
        risk_level=level,
        risk_score=score,
        score_breakdown=result["breakdown"],
        recommendations=get_recommendations(level, data),
        referral_options=get_referral_options(level),
        summary=build_summary(level, score, data),
    )


@app.post("/api/checkin-with-text", response_model=RiskResult)
def submit_checkin_with_text(data: CheckInWithTextData):
    """
    Check-in พร้อมข้อความเพิ่มเติมสำหรับ NLP analysis
    """
    combined_result = compute_combined_risk_score(data, data.additional_text)
    score = combined_result["combined_score"]
    level = get_risk_level(score)

    # ปรับคำแนะนำตาม NLP analysis ถ้ามี
    recommendations = get_recommendations(level, data)
    if combined_result["nlp_analysis"]:
        nlp_themes = combined_result["nlp_analysis"]["themes"]
        if "stress" in nlp_themes and "พักสมอง" not in " ".join(recommendations):
            recommendations.insert(0, "จากที่คุณเล่า ดูเหมือนจะเครียดค่อนข้างมาก — ลองหาเวลาพักสัก 10-15 นาทีก่อนนะ")

    return RiskResult(
        risk_level=level,
        risk_score=score,
        score_breakdown=combined_result["breakdown"],
        recommendations=recommendations,
        referral_options=get_referral_options(level),
        summary=build_summary(level, score, data),
    )


@app.get("/health")
def health():
    return {"status": "ok", "service": "KU Mind API"}
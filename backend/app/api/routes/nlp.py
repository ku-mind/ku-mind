from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.nlp import (
    NLPAnalysisRequest,
    NLPAnalysisResponse,
    ConversationSummaryRequest,
    ConversationSummaryResponse
)
from app.services.nlp_service import nlp_service

router = APIRouter(prefix="/nlp", tags=["nlp"])


@router.post("/analyze", response_model=NLPAnalysisResponse)
async def analyze_text(
    payload: NLPAnalysisRequest,
    _: User = Depends(get_current_user)
):
    """
    วิเคราะห์ข้อความด้วย NLP
    - Sentiment analysis
    - Emotion detection
    - Theme extraction
    - Risk scoring
    """
    try:
        result = nlp_service.analyze_message(payload.text)
        return NLPAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"NLP analysis failed: {str(e)}"
        ) from e


@router.post("/summarize", response_model=ConversationSummaryResponse)
async def summarize_conversation(
    payload: ConversationSummaryRequest,
    _: User = Depends(get_current_user)
):
    """
    สรุป conversation เป็นข้อความสั้นๆ
    """
    try:
        summary = nlp_service.summarize_conversation(
            payload.messages,
            payload.max_length
        )
        return ConversationSummaryResponse(summary=summary)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarization failed: {str(e)}"
        ) from e


@router.get("/health")
async def nlp_health_check():
    """
    ตรวจสอบว่า NLP models โหลดได้หรือไม่
    """
    try:
        # Test sentiment analysis
        test_result = nlp_service.analyze_sentiment("ฉันรู้สึกดีมาก")
        return {
            "status": "healthy",
            "sentiment_test": test_result,
            "models_loaded": True
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "models_loaded": False
        }
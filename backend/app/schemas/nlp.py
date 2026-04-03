from pydantic import BaseModel
from typing import List, Dict, Any


class NLPAnalysisRequest(BaseModel):
    text: str


class NLPAnalysisResponse(BaseModel):
    sentiment: Dict[str, Any]
    emotion: Dict[str, Any]
    themes: List[str]
    nlp_risk_score: float
    analysis_timestamp: str


class ConversationSummaryRequest(BaseModel):
    messages: List[str]
    max_length: int = 100


class ConversationSummaryResponse(BaseModel):
    summary: str
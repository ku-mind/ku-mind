from pydantic import BaseModel, Field


class ChatTurn(BaseModel):
    role: str = Field(pattern="^(user|assistant)$")
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=20)


class ChatNLPContext(BaseModel):
    sentiment: str
    emotion: str
    themes: list[str]
    nlp_risk: float


class RiskAssessment(BaseModel):
    risk_level: str
    risk_score: float
    matched_reasons: list[str] = Field(default_factory=list)
    requires_crisis_flow: bool = False
    high_confidence: bool = False


class ChatResponse(BaseModel):
    reply: str


class ChatWithContextResponse(ChatResponse):
    nlp_context: ChatNLPContext
    risk_assessment: RiskAssessment
    response_mode: str
    title_suggestion: str

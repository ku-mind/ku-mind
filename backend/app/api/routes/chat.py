from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse, ChatWithContextResponse
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, _: User = Depends(get_current_user)):
    try:
        reply = await ChatService().reply(payload.message, payload.history)
        return ChatResponse(reply=reply)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc


@router.post("/with-context", response_model=ChatWithContextResponse)
async def chat_with_context(payload: ChatRequest, _: User = Depends(get_current_user)):
    try:
        result = await ChatService().reply_with_context(payload.message, payload.history)
        return ChatWithContextResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc

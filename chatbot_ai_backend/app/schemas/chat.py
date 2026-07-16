from typing import Any

from pydantic import BaseModel, Field


class ChatMessageCreate(BaseModel):
    session_id: str = Field(..., max_length=120)
    role: str = Field(..., max_length=32)
    content: str


class ChatMessageRead(ChatMessageCreate):
    pass


class ChatRequest(BaseModel):
    session_id: str = Field(..., max_length=120)
    message: str = Field(..., min_length=1)
    language: str | None = Field(default=None, max_length=8)


class ChatSource(BaseModel):
    id: str
    score: float
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    detected_language: str | None = None
    provider: str
    model: str
    sources: list[ChatSource] = Field(default_factory=list)

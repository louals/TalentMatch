from typing import Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ApplicationCreate(BaseModel):
    user_id: UUID
    offer_id: UUID
    cover_letter: str
    matching_score: float

class ApplicationOut(BaseModel):
    id: UUID
    user_id: UUID
    offer_id: UUID
    cover_letter: Optional[str] = None
    matching_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

    class Config:
        from_attributes = True

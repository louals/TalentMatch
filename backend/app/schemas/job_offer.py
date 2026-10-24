from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Union

class JobOfferCreate(BaseModel):
    title: str
    description: str
    criteria: Union[str, dict]

class JobOfferOut(BaseModel):
    id: UUID
    title: str
    description: str
    criteria: Union[str, dict]
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True

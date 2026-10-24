from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Literal, Optional 

class UserCreate(BaseModel):
    email: EmailStr
    password: str | None = None
    first_name: str
    last_name: str
    role: Literal["candidate", "employer", "admin"] = "candidate"

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class LoginData(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None 
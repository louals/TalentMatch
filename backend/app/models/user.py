import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, DateTime, Enum as SqlEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

# User roles allowed in the system
class UserRole(str, Enum):
    candidate = "candidate"
    employer = "employer"
    admin = "admin"

# DB model for users table
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    role = Column(SqlEnum(UserRole), nullable=False, default=UserRole.candidate)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    
    # All job offers created by the user (if employer)
    job_offers = relationship("JobOffer", back_populates="creator", cascade="all, delete")
    # All job applications made by the user (if candidate)
    applications = relationship("Application", back_populates="applicant", cascade="all, delete")

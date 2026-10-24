import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

class JobOffer(Base):
    __tablename__ = "job_offers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    criteria = Column(JSON, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    creator = relationship("User", back_populates="job_offers")
    applications = relationship("Application", back_populates="job_offer", cascade="all, delete")

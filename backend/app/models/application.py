import uuid
from datetime import datetime
from sqlalchemy import Column, ForeignKey, Text, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    offer_id = Column(UUID(as_uuid=True), ForeignKey("job_offers.id"), nullable=False)
    cover_letter = Column(Text, nullable=True)
    matching_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    applicant = relationship("User", back_populates="applications")
    job_offer = relationship("JobOffer", back_populates="applications")

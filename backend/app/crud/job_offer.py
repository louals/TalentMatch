# crud/job_offer.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.job_offer import JobOffer
from app.schemas.job_offer import JobOfferCreate
from uuid import UUID

async def create_job_offer(db: AsyncSession, data: JobOfferCreate, user_id: UUID):
    offer = JobOffer(**data.dict(), created_by=user_id)
    db.add(offer)
    await db.commit()
    await db.refresh(offer)
    return offer

async def get_all_job_offers(db: AsyncSession):
    result = await db.execute(select(JobOffer))
    return result.scalars().all()

async def get_job_offer_by_id(db: AsyncSession, offer_id: UUID):
    result = await db.execute(select(JobOffer).where(JobOffer.id == offer_id))
    return result.scalars().first()

async def delete_job_offer(db: AsyncSession, offer_id: UUID):
    offer = await get_job_offer_by_id(db, offer_id)
    if offer:
        await db.delete(offer)
        await db.commit()
    return offer

async def update_job_offer(db: AsyncSession, offer_id: UUID, data: JobOfferCreate):
    result = await db.execute(select(JobOffer).where(JobOffer.id == offer_id))
    offer = result.scalar_one_or_none()

    if not offer:
        return None

    offer.title = data.title
    offer.description = data.description
    offer.criteria = data.criteria

    await db.commit()
    await db.refresh(offer)
    return offer

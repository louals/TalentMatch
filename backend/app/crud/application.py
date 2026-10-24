from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from uuid import UUID
from typing import List, Optional

from app.models.application import Application
from app.schemas.application import ApplicationCreate

async def create_application(db: AsyncSession, data: ApplicationCreate) -> Application:
    new_app = Application(**data.model_dump())
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)
    return new_app

async def get_application_by_id(db: AsyncSession, app_id: UUID) -> Optional[Application]:
    result = await db.execute(select(Application).where(Application.id == app_id))
    return result.scalar_one_or_none()

async def get_all_applications(db: AsyncSession) -> List[Application]:
    result = await db.execute(select(Application))
    return result.scalars().all()

async def get_applications_by_user(db: AsyncSession, user_id: UUID) -> List[Application]:
    result = await db.execute(select(Application).where(Application.user_id == user_id))
    return result.scalars().all()

async def get_applications_by_offer(db: AsyncSession, offer_id: UUID) -> List[Application]:
    result = await db.execute(select(Application).where(Application.offer_id == offer_id))
    return result.scalars().all()

async def delete_application(db: AsyncSession, app_id: UUID) -> bool:
    result = await db.execute(delete(Application).where(Application.id == app_id))
    await db.commit()
    return result.rowcount > 0



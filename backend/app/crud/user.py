from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.schemas.user import UserCreate
import uuid
import datetime
from passlib.hash import bcrypt


async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()


async def get_user_by_id(db: AsyncSession, user_id: uuid.UUID):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalars().first()


async def create_user(db: AsyncSession, user_data: UserCreate):
    raw_pwd = user_data.password or str(uuid.uuid4())          # mot de passe factice si None
    hashed_password = bcrypt.hash(raw_pwd)

    new_user = User(
        id=uuid.uuid4(),
        email=user_data.email,
        password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role=user_data.role,
        created_at=datetime.datetime.utcnow(),
    )
    db.add(new_user)
    try:
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except IntegrityError:
        await db.rollback()
        raise ValueError("Email already exists")


async def get_all_users(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()


async def update_user(db: AsyncSession, user_id: uuid.UUID, updates: dict) -> Optional[User]:
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        return None

    for field, value in updates.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user


async def delete_user(db: AsyncSession, user_id: uuid.UUID):
    user = await get_user_by_id(db, user_id)
    if not user:
        return None
    await db.delete(user)
    await db.commit()
    return True
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_async_session
from app.schemas.user import UserCreate, UserOut,UserUpdate
from app.crud import user as user_crud
from app.core.security import get_current_user
from app.models.user import User
import uuid
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserOut)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_async_session)):
    try:
        return await user_crud.create_user(db, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[UserOut])
async def list_users(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await user_crud.get_all_users(db)


@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id and current_user.role not in ("admin", "employer"):
        raise HTTPException(status_code=403, detail="Not authorized to view this user")
    
    user = await user_crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: uuid.UUID,
    updates: UserUpdate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this user")

    user = await user_crud.update_user(db, user_id, updates.dict(exclude_unset=True))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete users")

    deleted = await user_crud.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

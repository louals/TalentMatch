from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import get_user_by_email
from app.models.user import User
from app.core.security import create_access_token
from app.db.database import get_async_session
from passlib.hash import bcrypt
from app.schemas.user import UserCreate, UserOut
from app.crud.user import create_user, get_user_by_email
from app.schemas.auth import LoginInput

router = APIRouter()

@router.post("/login")
async def login(
    credentials: LoginInput,
    db: AsyncSession = Depends(get_async_session)
):
    user = await get_user_by_email(db, credentials.email)
    if not user or not bcrypt.verify(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_async_session)):
    existing_user = await get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = await create_user(db, user_data)
    return new_user

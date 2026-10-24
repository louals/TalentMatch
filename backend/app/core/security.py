from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.schemas.token import TokenData

from app.core.config import ALGORITHM

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_async_session
from app.crud.user import get_user_by_id


from dotenv import load_dotenv
import os


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    

security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_async_session),
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception

    user = await get_user_by_id(db, token_data.user_id)
    if not user:
        raise credentials_exception

    return user
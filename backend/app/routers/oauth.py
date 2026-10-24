# app/routers/oauth.py
from fastapi import APIRouter, Request, Depends, HTTPException
from starlette.responses import RedirectResponse
from app.auth.oauth import oauth
from app.schemas.user import UserCreate
from app.crud.user import get_user_by_email, create_user
from app.core.security import create_access_token
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_async_session
from uuid import uuid4
import os

router = APIRouter(prefix="/auth/google", tags=["Auth"])

@router.get("/login")
async def login_via_google(request: Request):

    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_async_session)):
    try:
        token = await oauth.google.authorize_access_token(request)
        userinfo = token.get("userinfo")
    except Exception:
        raise HTTPException(status_code=400, detail="OAuth failed")

    if not userinfo:
        raise HTTPException(status_code=400, detail="User info not found")

    email = userinfo["email"]
    user = await get_user_by_email(db, email)

    if not user:
        #  S'il est nouveau, on l’enregistre
        user = await create_user(
            db,
            UserCreate(
                email=email,
                password=None,  # Aucun mot de passe fourni par Google
                first_name=userinfo.get("given_name", ""),
                last_name=userinfo.get("family_name", ""),
                role="candidate"
            )
        )

    #  Créer un JWT token
    token = create_access_token({"sub": str(user.id)})
    
    #  Redirige vers frontend avec token dans l’URL
    return RedirectResponse(f"http://localhost:5173/login/success?token={token}")

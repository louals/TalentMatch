from fastapi import FastAPI
from app.routers import user , job_offer , auth,oauth
from app.routers import application ,cv,match
from starlette.middleware.sessions import SessionMiddleware
import os
from app.db.database import engine  
from app.models.base import Base 

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY")
)

@app.get("/")
async def root():
    return {"message": "Backend is alive!"}


app.include_router(auth.router)
app.include_router(user.router)
app.include_router(job_offer.router)
app.include_router(application.router)
app.include_router(cv.router)
app.include_router(match.router)
app.include_router(oauth.router)

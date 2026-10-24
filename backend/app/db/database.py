# app/db/database.py

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from typing import AsyncGenerator

from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

POSTGRESQL_URL = os.getenv("POSTGRESQL_URL")
MONGODB_URL = os.getenv("MONGODB_URL")

# PostgreSQL async engine + session
engine = create_async_engine(POSTGRESQL_URL, echo=True, future=True)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

# MongoDB async client
mongo_client = AsyncIOMotorClient(MONGODB_URL)
mongo_db = mongo_client["jobmatching"]   


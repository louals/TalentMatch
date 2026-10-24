import asyncio
from app.db.database import get_async_session, mongo_client
from sqlalchemy import text


async def test_postgres():
    print("Testing PostgreSQL connection...")
    try:
        # Use async for because get_async_session is an async generator
        async for session in get_async_session():
            result = await session.execute(text("SELECT 1"))
            print("PostgreSQL connected:", result.scalar())
    except Exception as e:
        print("PostgreSQL connection failed:", e)

def test_mongo():
    print("Testing MongoDB connection...")
    try:
        # The ping command is the simplest way to check MongoDB connection
        mongo_client.admin.command('ping')
        print("MongoDB connected!")
    except Exception as e:
        print("MongoDB connection failed:", e)

async def main():
    await test_postgres()
    test_mongo()

if __name__ == "__main__":
    asyncio.run(main())

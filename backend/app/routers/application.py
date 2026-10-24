from datetime import datetime, timezone


import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID, uuid4
from typing import List
from sqlalchemy import select


from app.db.database import get_async_session
from app.schemas.application import ApplicationCreate, ApplicationOut
from app.crud import application as crud
from app.core.security import get_current_user
from app.db.database import mongo_db
from app.models.job_offer import JobOffer
from app.services.generate_cover_letter import generate_cover_letter, replace_placeholders

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
async def create_application_route(data: ApplicationCreate, db: AsyncSession = Depends(get_async_session)):
    return await crud.create_application(db, data)

@router.get("/", response_model=List[ApplicationOut])
async def get_all_applications_route(db: AsyncSession = Depends(get_async_session)):
    return await crud.get_all_applications(db)

@router.get("/{app_id}", response_model=ApplicationOut)
async def get_application_by_id_route(app_id: UUID, db: AsyncSession = Depends(get_async_session)):
    app = await crud.get_application_by_id(db, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.get("/user/{user_id}", response_model=List[ApplicationOut])
async def get_applications_by_user(user_id: UUID, db: AsyncSession = Depends(get_async_session)):
    return await crud.get_applications_by_user(db, user_id)

@router.get("/offer/{offer_id}", response_model=List[ApplicationOut])
async def get_applications_by_offer(offer_id: UUID, db: AsyncSession = Depends(get_async_session)):
    return await crud.get_applications_by_offer(db, offer_id)

@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_application_route(app_id: UUID, db: AsyncSession = Depends(get_async_session)):
    success = await crud.delete_application(db, app_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")
    
@router.post("/generate-from-matches", response_model=List[ApplicationOut])
async def generate_applications_from_matches(
    db: AsyncSession = Depends(get_async_session),
    current_user = Depends(get_current_user)
):
    # Fetch all user's CVs
    cvs = [cv async for cv in mongo_db["cvs"].find({"user_id": str(current_user.id)})]
    if not cvs:
        raise HTTPException(status_code=404, detail="No CVs found")

    cv_map = {str(cv["_id"]): cv for cv in cvs}

    # Fetch all matches that reference those CVs
    matches = [m async for m in mongo_db["matches"].find({"cv_id": {"$in": list(cv_map.keys())}})]
    if not matches:
        raise HTTPException(status_code=404, detail="No matches found")

    # Get unique job offer IDs from matches
    job_offer_ids = list(set(match["job_offer_id"] for match in matches))
    result = await db.execute(JobOffer.__table__.select().where(JobOffer.id.in_(job_offer_ids)))
    job_offers = result.fetchall()
    job_offer_map = {str(job.id): job for job in job_offers}

    applications_created = []

    for match in matches:
        cv = cv_map.get(match["cv_id"])
        job = job_offer_map.get(match["job_offer_id"])
        if not cv or not job:
            continue

        parsed_cv = cv.get("parsed_info")
        if not parsed_cv:
            continue

        job_info = {
            "title": job.title,
            "description": job.description,
            "required_skills": [],  # You can populate this if your job table includes it
        }

        # Generate raw letter (with placeholders)
        raw_letter = await generate_cover_letter(parsed_cv, job_info)

        # Replace placeholders with parsed_cv info only
        final_letter = replace_placeholders(raw_letter, parsed_cv)

        app_data = ApplicationCreate(
            id=uuid4(),
            user_id=current_user.id,
            offer_id=job.id,
            cover_letter=final_letter,
            matching_score=match.get("score", 0.0),
            created_at=datetime.now(timezone.utc)
        )

        application = await crud.create_application(db, app_data)
        applications_created.append(application)

    return applications_created

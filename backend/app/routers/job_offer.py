from fastapi import APIRouter, Depends, HTTPException, status, Body, Response
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.schemas.job_offer import JobOfferCreate, JobOfferOut
from app.crud import job_offer as job_crud
from app.db.database import get_async_session
from app.models.user import User

from app.utils.role_check import employer_only  

router = APIRouter(prefix="/job-offers", tags=["Job Offers"])

#  Employers only can create job offers
@router.post("/", response_model=JobOfferOut)
async def create_job_offer(
    data: JobOfferCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(employer_only),
):
    return await job_crud.create_job_offer(db, data, current_user.id)

#  Public access (job seekers can browse offers)
@router.get("/", response_model=list[JobOfferOut])
async def get_all_offers(db: AsyncSession = Depends(get_async_session)):
    return await job_crud.get_all_job_offers(db)

@router.get("/{offer_id}", response_model=JobOfferOut)
async def get_one_offer(offer_id: UUID, db: AsyncSession = Depends(get_async_session)):
    offer = await job_crud.get_job_offer_by_id(db, offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Job offer not found")
    return offer

#  Only employer who created the offer can update
@router.put("/{offer_id}", response_model=JobOfferOut)
async def update_offer(
    offer_id: UUID,
    data: JobOfferCreate = Body(...),
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(employer_only),
):
    offer = await job_crud.get_job_offer_by_id(db, offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Job offer not found")

    if offer.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="You can only update your own offers")

    return await job_crud.update_job_offer(db, offer_id, data)

# Only employer who created the offer can delete
@router.delete("/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_offer(
    offer_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(employer_only),
):
    offer = await job_crud.get_job_offer_by_id(db, offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Job offer not found")

    if offer.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own offers")

    await job_crud.delete_job_offer(db, offer_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

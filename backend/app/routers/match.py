from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import mongo_db, get_async_session
from app.models.job_offer import JobOffer
from app.services.matching_engine import compute_similarity_score, generate_justification, serialize_cv, serialize_job_offer
from app.core.security import get_current_user
import json

router = APIRouter(prefix="/match", tags=["Matching"])

@router.post("/run")
async def match_user_cvs_to_jobs(
    db: AsyncSession = Depends(get_async_session),
    current_user=Depends(get_current_user)  # <-- use token to get current user
):
    # Fetch the user's CVs only
    cvs_cursor = mongo_db["cvs"].find({"user_id": str(current_user.id)})
    cvs = [cv async for cv in cvs_cursor]

    # Fetch all job offers
    job_rows = (await db.execute(JobOffer.__table__.select())).fetchall()

    if not cvs or not job_rows:
        raise HTTPException(status_code=404, detail="No CVs or job offers found.")

    matches = []

    for cv in cvs:
        parsed = cv.get("parsed_info")
        if not parsed:
            continue

        serialized_cv = serialize_cv(parsed)

        for job in job_rows:
            # Parse job criteria
            try:
                criteria_json = json.loads(job.criteria) if job.criteria else {}
            except Exception as e:
                print(f"[Criteria Error] {e}")
                criteria_json = {}

            job_dict = {
                "title": job.title,
                "description": job.description,
                "required_skills": criteria_json.get("skills", [])
            }

            serialized_job = serialize_job_offer(job_dict)

            score = compute_similarity_score(serialized_cv, serialized_job)

            justification = await generate_justification(serialized_cv, serialized_job)



            matches.append({
                "cv_id": str(cv["_id"]),
                "job_offer_id": str(job.id),
                "score": score,
                "justification": justification
            })

    # Optional: Delete old matches for just this user
    await mongo_db["matches"].delete_many({"cv_id": {"$in": [str(cv["_id"]) for cv in cvs]}})
    await mongo_db["matches"].insert_many(matches)

    return {"message": "Matching complete", "matched_cvs": len(cvs), "matches": len(matches)}

@router.get("/results")
async def get_match_results(
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    user_id = str(current_user.id)  

    # 1. Get user CVs from Mongo
    user_cvs_cursor = mongo_db["cvs"].find({"user_id": user_id})
    user_cvs = [cv async for cv in user_cvs_cursor]
    if not user_cvs:
        raise HTTPException(status_code=404, detail="No CVs found for user")

    user_cv_ids = [str(cv["_id"]) for cv in user_cvs]

    # 2. Find matches for these CVs
    matches_cursor = mongo_db["matches"].find({"cv_id": {"$in": user_cv_ids}})
    matches = [match async for match in matches_cursor]
    if not matches:
        return {"message": "No matches found", "matches": []}

    # 3. Fetch job offers from Postgres for matched job_offer_ids
    job_offer_ids = list(set(match["job_offer_id"] for match in matches))
    job_offers_query = await db.execute(
        JobOffer.__table__.select().where(JobOffer.id.in_(job_offer_ids))
    )
    job_offers = job_offers_query.fetchall()

    # Map job offers by id for quick lookup
    job_offer_map = {str(job.id): job for job in job_offers}

    # 4. Prepare response list with job offer info + match score
    result = []
    for match in matches:
        job_offer = job_offer_map.get(match["job_offer_id"])
        if job_offer:
            result.append({
                "job_offer_id": match["job_offer_id"],
                "title": job_offer.title,
                "description": job_offer.description,
                "score": match.get("score", 0.0),
                "justification": match.get("justification", "Non spécifiée")
})

    return {"message": "Matches retrieved", "matches": result}

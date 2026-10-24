from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
from typing import List
from datetime import datetime
from io import BytesIO
from bson import ObjectId
import os
from fastapi import status

from dotenv import load_dotenv
load_dotenv()

import openai
openai.api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPEN_AI_KEY")

from app.db.database import mongo_db
from app.core.security import get_current_user
from app.schemas.user import UserOut
from app.utils.pdf_extractor import extract_text_from_pdf
from app.utils.cv_parser import extract_cv_info_with_openai

router = APIRouter(prefix="/cvs", tags=["CVs"])


@router.post("/upload", summary="Upload and parse CV")
async def upload_cv(
    file: UploadFile = File(...),
    current_user: UserOut = Depends(get_current_user)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for now.")

    contents = await file.read()

    # 1. Extract raw text from PDF
    extracted_text = extract_text_from_pdf(contents)

    # 2. Run OpenAI to extract info
    cv_info = extract_cv_info_with_openai(extracted_text)

    # 3. Build Mongo doc
    cv_doc = {
        "filename": file.filename,
        "user_id": str(current_user.id),
        "upload_date": datetime.utcnow(),
        "content": contents,
        "extracted_text": extracted_text,
        "parsed_info": cv_info
    }

    # 4. Insert into MongoDB
    result = await mongo_db["cvs"].insert_one(cv_doc)

    return {
        "cv_id": str(result.inserted_id),
        "message": "CV uploaded and processed.",
        "parsed_info": cv_info
    }
    
@router.get("/all", summary="List all CVs (admin only)", response_model=List[dict])
async def list_all_cvs(current_user: UserOut = Depends(get_current_user)):
    # Simple role check — adjust to your role system
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")

    cvs_cursor = mongo_db["cvs"].find({}, {"content": 0})
    cvs = []
    async for cv in cvs_cursor:
        cv["_id"] = str(cv["_id"])
        cvs.append(cv)
    return cvs


@router.get("/", summary="List all CVs (user only)", response_model=List[dict])
async def list_cvs(current_user: UserOut = Depends(get_current_user)):
    cvs_cursor = mongo_db["cvs"].find(
        {"user_id": str(current_user.id)},
        {"content": 0} 
    )
    cvs = []
    async for cv in cvs_cursor:
        cv["_id"] = str(cv["_id"])
        cvs.append(cv)
    return cvs


@router.get("/download/{cv_id}", summary="Download a CV PDF")
async def download_cv(cv_id: str, current_user: UserOut = Depends(get_current_user)):
    cv = await mongo_db["cvs"].find_one({"_id": ObjectId(cv_id)})

    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")

    if cv["user_id"] != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not your CV, buddy.")

    file_like = BytesIO(cv["content"])
    return StreamingResponse(file_like, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename={cv['filename']}"
    })
    
@router.delete("/{cv_id}", summary="Delete a CV", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cv(cv_id: str, current_user: UserOut = Depends(get_current_user)):
    cv = await mongo_db["cvs"].find_one({"_id": ObjectId(cv_id)})

    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")

    if cv["user_id"] != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not your CV, buddy.")

    await mongo_db["cvs"].delete_one({"_id": ObjectId(cv_id)})
    return  # 204 = empty body on success--------- why does the admin cant see all the cvs ?

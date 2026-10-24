from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user
from app.models.user import User

def employer_only(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Employers only")
    return current_user
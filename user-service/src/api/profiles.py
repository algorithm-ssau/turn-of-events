from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.base import get_db  # добавьте этот импорт
from src.db import models
from src.schemas.user import UserProfile, UserProfileUpdate
from src.services.users import get_user, update_user

router = APIRouter()

@router.get("/profiles/{user_id}", response_model=UserProfile)
def read_profile(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/profiles/{user_id}", response_model=UserProfile)
def update_profile(user_id: int, profile: UserProfileUpdate, db: Session = Depends(get_db)):
    user = update_user(db, user_id, profile)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
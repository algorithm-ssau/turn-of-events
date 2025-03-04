from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.base import get_db
from src.schemas.user import UserCreate, UserResponse, UserUpdate
from src.services.users import UserService, get_user, update_user

router = APIRouter()

@router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    service = UserService(db)
    new_user = service.create_user(user)
    return new_user

@router.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}", response_model=UserResponse)
def modify_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
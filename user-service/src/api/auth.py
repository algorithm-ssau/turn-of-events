from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db import models
from src.schemas.auth import UserCreate, UserLogin
from src.services.auth import AuthService
from src.core.security import create_access_token
from src.db.base import get_db   # добавлен импорт функции get_db

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if AuthService.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = AuthService.create_user(db, user)
    return {"msg": "User registered successfully", "user": user}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = AuthService.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}
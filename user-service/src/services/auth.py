from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from ..db import models
from ..db.base import get_db
from ..schemas.auth import UserCreate, UserResponse
from ..core.security import hash_password, verify_password

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, user: UserCreate) -> UserResponse:
        hashed_password = hash_password(user.password)
        db_user = models.User(email=user.email, hashed_password=hashed_password)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return UserResponse(email=db_user.email)

    def authenticate_user(self, email: str, password: str) -> UserResponse:
        user = self.db.query(models.User).filter(models.User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        return UserResponse(email=user.email)
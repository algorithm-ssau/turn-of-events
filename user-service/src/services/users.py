from sqlalchemy.orm import Session
from src.db.models import User
from src.schemas.user import UserCreate, UserUpdate
from src.core.security import hash_password

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_create: UserCreate) -> User:
        hashed_password = hash_password(user_create.password)
        db_user = User(**user_create.dict(), password=hashed_password)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_user(self, user_id: int) -> User:
        return self.db.query(User).filter(User.id == user_id).first()

    def update_user(self, user_id: int, user_update: UserUpdate) -> User:
        db_user = self.get_user(user_id)
        if not db_user:
            return None
        for key, value in user_update.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def delete_user(self, user_id: int) -> None:
        db_user = self.get_user(user_id)
        if db_user:
            self.db.delete(db_user)
            self.db.commit()

def get_user(db: Session, user_id: int) -> User:
    return UserService(db).get_user(user_id)

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> User:
    return UserService(db).update_user(user_id, user_update)


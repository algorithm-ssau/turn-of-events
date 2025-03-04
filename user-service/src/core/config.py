import os

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:admin123@localhost/afisha_db")
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    DEBUG = os.getenv("DEBUG", "False") == "True"
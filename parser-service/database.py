import os
import urllib.parse
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Настройка логирования
logger = logging.getLogger(__name__)

# Загрузка переменных окружения
load_dotenv()
# Загрузка секретов (если файл существует)
secrets_path = os.path.join(os.path.dirname(__file__), '.env.secrets')
if os.path.exists(secrets_path):
    load_dotenv(secrets_path)
else:
    logger.warning("Файл с секретами (.env.secrets) не найден. Используйте переменные окружения.")

# Получение параметров подключения к БД
db_user = os.getenv("DB_USER", "postgres")
db_password = os.getenv("DB_PASSWORD", "postgres")
db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "5432")
db_name = os.getenv("DB_NAME", "afisha")

# Кодирование пароля для URL
encoded_password = urllib.parse.quote_plus(db_password)

# Формирование строки подключения
DATABASE_URL = f"postgresql://{db_user}:{encoded_password}@{db_host}:{db_port}/{db_name}"

# Создание движка SQLAlchemy
engine = create_engine(DATABASE_URL)

# Создание фабрики сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Создание базового класса для ORM-моделей
Base = declarative_base()

# Функция для получения сессии базы данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
import os
import threading
import signal
import logging
from datetime import datetime
from typing import Dict, Any, List

import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from kafka import KafkaConsumer
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from models import Event, EventCreate, EventDB
from opera_parser import get_opera_events, save_events_to_db
from database import engine, Base, get_db

# Загрузка переменных окружения
load_dotenv()

# Создание таблиц при запуске, если их нет
# В продакшн следует использовать миграции через Alembic
Base.metadata.create_all(bind=engine)

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Инициализация FastAPI
app = FastAPI(
    title="Parser Service",
    description="Сервис для парсинга афиши Самарского театра оперы и балета",
    version="1.0.0"
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Настройка Kafka
kafka_broker = os.getenv("KAFKA_BROKER", "localhost:9093")
topic = os.getenv("TOPIC", "parsing")
group_id = os.getenv("GROUP_ID", "1")

# Флаг для управления работой Kafka consumer
kafka_running = True


@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Проверка работоспособности сервиса"""
    return {
        "status": "ok",
        "time": datetime.now().isoformat()
    }


@app.post("/parse")
async def parse_events(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Ручной запуск парсинга событий"""
    try:
        events = get_opera_events()
        save_events_to_db(db, events)
        return {
            "message": "Парсинг завершен успешно",
            "count": len(events)
        }
    except Exception as e:
        logger.error(f"Ошибка при парсинге: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/events", response_model=List[Event])
async def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Получение списка событий"""
    events = db.query(EventDB).offset(skip).limit(limit).all()
    return events


def kafka_consumer_thread():
    """Функция для работы с Kafka в отдельном потоке"""
    try:
        consumer = KafkaConsumer(
            topic,
            bootstrap_servers=[kafka_broker],
            group_id=group_id,
            auto_offset_reset='earliest',
            enable_auto_commit=True,
            value_deserializer=lambda x: x.decode('utf-8')
        )
        
        logger.info(f"Kafka консьюмер запущен, слушает топик {topic}")
        
        for message in consumer:
            if not kafka_running:
                break
                
            logger.info(f"Получено сообщение: {message.value}")
            
            if message.value == "startOpera":
                try:
                    # Получаем сессию базы данных
                    db = next(get_db())
                    events = get_opera_events()
                    save_events_to_db(db, events)
                    logger.info("Парсинг завершён, данные сохранены в БД.")
                except Exception as e:
                    logger.error(f"Ошибка парсинга: {e}")
    
    except Exception as e:
        logger.error(f"Ошибка в Kafka консьюмере: {e}")
    finally:
        logger.info("Kafka консьюмер остановлен")


def handle_shutdown(signum, frame):
    """Обработчик сигнала завершения"""
    global kafka_running
    logger.info("Получен сигнал завершения, останавливаем сервисы...")
    kafka_running = False


def main():
    """Запуск приложения"""
    # Настройка обработчиков сигналов для graceful shutdown
    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)
    
    # Запуск Kafka consumer в отдельном потоке
    kafka_thread = threading.Thread(target=kafka_consumer_thread)
    kafka_thread.daemon = True
    kafka_thread.start()
    
    # Запуск FastAPI сервера
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=False)
    
    # Ожидание завершения потока Kafka
    kafka_running = False
    kafka_thread.join(timeout=5)


if __name__ == "__main__":
    main() 
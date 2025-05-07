import os
import threading
import signal
import logging
from datetime import datetime
from typing import Dict, Any, List

import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from kafka import KafkaConsumer
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from models import Event, EventCreate, EventDB
from database import engine, Base, get_db

# Импорты парсеров
from opera_parser import get_opera_events, save_events_to_db as save_opera_events_to_db
from samart_parser import get_samart_events, save_events_to_db as save_samart_events_to_db
from drama_parser import get_drama_events, save_events_to_db as save_drama_events_to_db

# Загрузка переменных окружения
load_dotenv()

# Создание таблиц при запуске
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
    description="Сервис для парсинга афиш театров",
    version="1.0.0"
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Конфигурация Kafka
kafka_broker = os.getenv("KAFKA_BROKER", "localhost:9093")
topic = os.getenv("TOPIC", "parsing")
group_id = os.getenv("GROUP_ID", "1")

# Флаг для остановки Kafka consumer
kafka_running = True

# Реестр доступных парсеров
parsers = {
    "opera": (get_opera_events, save_opera_events_to_db),
    "samart": (get_samart_events, save_samart_events_to_db),
    "drama": (get_drama_events, save_drama_events_to_db),
}

@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Проверка работоспособности сервиса"""
    return {
        "status": "ok",
        "time": datetime.now().isoformat()
    }

@app.post("/parse")
async def parse_events(
    parser: str = Query("opera", enum=list(parsers.keys())),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Ручной запуск парсинга событий"""
    try:
        get_events_func, save_func = parsers[parser]
        events = get_events_func()
        save_func(db, events)
        return {
            "message": f"Парсинг {parser} завершён успешно",
            "count": len(events)
        }
    except Exception as e:
        logger.error(f"Ошибка при парсинге {parser}: {e}")
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

            command = message.value.strip()
            logger.info(f"Получено сообщение: {command}")

            # Преобразуем команду вида 'startOpera' -> 'opera'
            parser_key = command.replace("start", "").lower()

            if parser_key in parsers:
                try:
                    db = next(get_db())
                    get_events_func, save_func = parsers[parser_key]
                    events = get_events_func()
                    save_func(db, events)
                    logger.info(f"Парсинг {parser_key} завершён, данные сохранены в БД.")
                except Exception as e:
                    logger.error(f"Ошибка при парсинге {parser_key}: {e}")
            else:
                logger.warning(f"Неизвестная команда: {command}")

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
    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)

    kafka_thread = threading.Thread(target=kafka_consumer_thread)
    kafka_thread.daemon = True
    kafka_thread.start()

    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=False)

    kafka_running = False
    kafka_thread.join(timeout=5)

if __name__ == "__main__":
    main()

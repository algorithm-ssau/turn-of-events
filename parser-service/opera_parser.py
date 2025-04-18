import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime
from sqlalchemy.orm import Session

from models import Event, EventCreate, EventDB

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_opera_events() -> list[EventCreate]:
    """
    Парсит события с сайта Самарского театра оперы и балета
    """
    url = "https://opera-samara.ru/afisha/"
    events = []
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Проверка на успешный ответ
        
        soup = BeautifulSoup(response.text, 'html.parser')
        items = soup.select("li.item")
        
        for item in items:
            try:
                date = item.select_one(".dateBox .date").text.strip() if item.select_one(".dateBox .date") else ""
                time = item.select_one(".dateBox .time").text.strip() if item.select_one(".dateBox .time") else ""
                title = item.select_one(".name").text.strip() if item.select_one(".name") else ""
                genre = item.select_one(".inf.genre").text.strip() if item.select_one(".inf.genre") else ""
                duration = item.select_one(".lenght").text.strip() if item.select_one(".lenght") else ""
                image_url = item.select_one("no_print").get("src") if item.select_one("no_print") else ""
                link = item.select_one("a").get("href") if item.select_one("a") else ""
                
                # Вывод для отладки
                logger.info(f"Найдено: {date}, {time}, {title}, {genre}, {duration}, {image_url}, {link}")
                
                if title and date:
                    events.append(EventCreate(
                        title=title,
                        date=date,
                        time=time,
                        price="",  # На сайте нет информации о цене
                        place="Самарский театр оперы и балета",
                        image_url=image_url
                    ))
            except Exception as e:
                logger.error(f"Ошибка при обработке элемента: {e}")
        
        if not events:
            logger.warning("❌ Парсер не нашел ни одного события! Проверьте селекторы.")
        
        return events
        
    except requests.RequestException as e:
        logger.error(f"Ошибка при запросе к сайту: {e}")
        raise Exception(f"Ошибка при запросе к сайту: {e}")


def save_events_to_db(db: Session, events: list[EventCreate]):
    """
    Сохраняет события в базу данных PostgreSQL используя SQLAlchemy
    """
    for event_data in events:
        try:
            # Проверяем наличие события в базе
            existing_event = db.query(EventDB).filter(
                EventDB.title == event_data.title,
                EventDB.date == event_data.date,
                EventDB.place == event_data.place
            ).first()
            
            # Если событие не существует, создаем новое
            if not existing_event:
                db_event = EventDB(
                    title=event_data.title,
                    date=event_data.date,
                    time=event_data.time,
                    price=event_data.price,
                    place=event_data.place,
                    image_url=event_data.image_url,
                    created_at=datetime.now()
                )
                db.add(db_event)
                db.commit()
                db.refresh(db_event)
                logger.info(f"Новое событие сохранено: {event_data.title}")
            else:
                logger.info(f"Событие уже существует: {event_data.title}")
                
        except Exception as e:
            db.rollback()
            logger.error(f"Ошибка записи в базу данных: {e}") 
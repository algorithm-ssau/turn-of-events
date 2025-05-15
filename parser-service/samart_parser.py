import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime
import urllib.parse

from models import Event, EventCreate, EventDB
from sqlalchemy.orm import Session

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_samart_events() -> list[EventCreate]:
    """
    Парсит события с сайта Самарского театра юного зрителя «СамАрт»
    """
    url = "https://samart.ru/poster/"
    base_url = "https://samart.ru"
    events = []

    try:
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        event_items = soup.select(".poster-item")

        for item in event_items:
            try:
                # Дата
                date_elem = item.select_one(".poster-item__date")
                date_text = date_elem.get_text(strip=True) if date_elem else ""

                # Время
                time_elem = item.select_one(".poster-item__time")
                time_text = time_elem.get_text(strip=True) if time_elem else ""

                # Название спектакля
                title_elem = item.select_one(".poster-item__title")
                title = title_elem.get_text(strip=True) if title_elem else ""

                # Возрастное ограничение
                age_elem = item.select_one(".poster-item__age")
                age_limit = age_elem.get_text(strip=True) if age_elem else ""

                # Место проведения
                place_elem = item.select_one(".poster-item__scene")
                place = place_elem.get_text(strip=True) if place_elem else "СамАрт"

                # Описание (краткое)
                desc_elem = item.select_one(".poster-item__description")
                description = desc_elem.get_text(strip=True) if desc_elem else ""

                # Ссылка на билет
                link_elem = item.select_one("a.poster-item__link")
                link = ""
                if link_elem and link_elem.has_attr("href"):
                    link = urllib.parse.urljoin(base_url, link_elem["href"])

                # Картинка спектакля
                img_elem = item.select_one(".poster-item__img img")
                image_url = ""
                if img_elem and img_elem.has_attr("src"):
                    img_src = img_elem["src"]
                    image_url = urllib.parse.urljoin(base_url, img_src)

                # Вывод для отладки
                logger.info(f"Найден спектакль:")
                logger.info(f"  Название: {title}")
                logger.info(f"  Дата: {date_text} {time_text}")
                logger.info(f"  Место: {place}")
                logger.info(f"  Ссылка: {link}")

                if title and date_text:
                    event = EventCreate(
                        title=title,
                        date=date_text,
                        time=time_text,
                        price="",
                        place=place,
                        image_url=image_url,
                        genre="",
                        duration="",
                        director="",
                        link=link,
                        description=description
                    )
                    events.append(event)

            except Exception as e:
                logger.error(f"Ошибка при обработке спектакля: {e}")

        if not events:
            logger.warning("❌ Спектакли не найдены. Проверьте селекторы.")

        return events

    except requests.RequestException as e:
        logger.error(f"Ошибка при запросе: {e}")
        raise


def save_events_to_db(db: Session, events: list[EventCreate]):
    """
    Сохраняет события в базу данных PostgreSQL используя SQLAlchemy
    """
    for event_data in events:
        try:
            existing_event = db.query(EventDB).filter(
                EventDB.title == event_data.title,
                EventDB.date == event_data.date,
                EventDB.place == event_data.place
            ).first()

            if not existing_event:
                db_event = EventDB(
                    title=event_data.title,
                    date=event_data.date,
                    time=event_data.time,
                    price=event_data.price,
                    place=event_data.place,
                    image_url=event_data.image_url,
                    genre=event_data.genre,
                    duration=event_data.duration,
                    director=event_data.director,
                    link=event_data.link,
                    description=event_data.description,
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

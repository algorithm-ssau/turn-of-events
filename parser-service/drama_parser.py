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


def get_drama_events() -> list[EventCreate]:
    """
    Парсит события с сайта Самарского академического театра драмы
    """
    url = "https://dramtheatre.ru/events/"
    base_url = "https://dramtheatre.ru"
    events = []

    try:
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        event_items = soup.select(".afisha-list__item")

        for item in event_items:
            try:
                # Дата и время
                datetime_raw = item.select_one(".afisha-date__info")
                date_str = ""
                time_str = ""
                if datetime_raw:
                    parts = datetime_raw.get_text(strip=True).split()
                    if len(parts) >= 2:
                        date_str = parts[0]  # формат типа "6.04"
                        time_str = parts[1]  # формат типа "18:00"

                # Название спектакля
                title_elem = item.select_one(".afisha-name")
                title = title_elem.get_text(strip=True) if title_elem else ""

                # Ссылка на подробности
                detail_link_elem = item.select_one(".afisha-more a")
                link = ""
                if detail_link_elem and detail_link_elem.has_attr("href"):
                    link = urllib.parse.urljoin(base_url, detail_link_elem["href"])

                # Картинка
                image_elem = item.select_one(".afisha-poster img")
                image_url = ""
                if image_elem and image_elem.has_attr("src"):
                    img_src = image_elem["src"]
                    image_url = urllib.parse.urljoin(base_url, img_src)

                # Описание
                description = ""
                if link:
                    description = get_event_description(link)

                # Вывод для отладки
                logger.info(f"Найден спектакль:")
                logger.info(f"  Название: {title}")
                logger.info(f"  Дата: {date_str}, Время: {time_str}")
                logger.info(f"  URL изображения: {image_url}")
                logger.info(f"  Ссылка: {link}")

                if title and date_str:
                    event = EventCreate(
                        title=title,
                        date=date_str,
                        time=time_str,
                        price="",  # Цена на сайте отсутствует
                        place="Самарский академический театр драмы",
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


def get_event_description(event_url: str) -> str:
    """
    Получает описание спектакля с детальной страницы
    """
    try:
        response = requests.get(event_url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        description_elem = soup.select_one(".play-detail__description")

        if description_elem:
            return description_elem.get_text(strip=True)
        return ""
    except Exception as e:
        logger.error(f"Ошибка при получении описания спектакля: {e}")
        return ""


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

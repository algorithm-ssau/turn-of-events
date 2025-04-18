import requests
from bs4 import BeautifulSoup
import logging
from datetime import datetime
from sqlalchemy.orm import Session
import urllib.parse

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
                # Основные данные
                date = item.select_one(".dateBox .date").text.strip() if item.select_one(".dateBox .date") else ""
                time = item.select_one(".dateBox .time").text.strip() if item.select_one(".dateBox .time") else ""
                title = item.select_one(".name").text.strip() if item.select_one(".name") else ""
                
                # Дополнительные данные
                genre = item.select_one(".inf.genre").text.strip() if item.select_one(".inf.genre") else ""
                duration = item.select_one(".lenght").text.strip() if item.select_one(".lenght") else ""
                director = item.select_one(".inf.director").text.strip() if item.select_one(".inf.director") else ""
                
                # Получение URL изображения
                img_elem = item.select_one(".image img.no_print")
                image_url = ""
                if img_elem and img_elem.has_attr("src"):
                    # Получаем относительный URL изображения
                    img_src = img_elem["src"]
                    # Преобразуем в абсолютный URL, если это относительный путь
                    if img_src.startswith("/"):
                        base_url = "https://opera-samara.ru"
                        image_url = urllib.parse.urljoin(base_url, img_src)
                    else:
                        image_url = img_src
                
                # Получение ссылки на детальную страницу события
                link_elem = item.select_one("a")
                link = ""
                if link_elem and link_elem.has_attr("href"):
                    href = link_elem["href"]
                    if href.startswith("/"):
                        base_url = "https://opera-samara.ru"
                        link = urllib.parse.urljoin(base_url, href)
                    else:
                        link = href
                
                # Цена (обычно пустая на этом сайте)
                price = item.select_one(".price").text.strip() if item.select_one(".price") else ""
                
                # Вывод для отладки
                logger.info(f"Найдено событие:")
                logger.info(f"  Название: {title}")
                logger.info(f"  Дата: {date}, Время: {time}")
                logger.info(f"  Жанр: {genre}, Режиссер: {director}")
                logger.info(f"  Продолжительность: {duration}, Цена: {price}")
                logger.info(f"  URL изображения: {image_url}")
                logger.info(f"  Ссылка: {link}")
                
                if title and date:
                    # Создаем объект события со всеми данными
                    event = EventCreate(
                        title=title,
                        date=date,
                        time=time,
                        price=price,
                        place="Самарский театр оперы и балета",
                        image_url=image_url,
                        genre=genre,
                        duration=duration,
                        director=director,
                        link=link,
                        description=""  # Описание получаем со страницы события (можно добавить отдельную функцию)
                    )
                    events.append(event)
                    
                    # Опционально: получение дополнительной информации со страницы события
                    # Раскомментируйте, если нужно получать описание события
                    # if link:
                    #     description = get_event_description(link)
                    #     event.description = description
            except Exception as e:
                logger.error(f"Ошибка при обработке элемента: {e}")
        
        if not events:
            logger.warning("❌ Парсер не нашел ни одного события! Проверьте селекторы.")
        
        return events
        
    except requests.RequestException as e:
        logger.error(f"Ошибка при запросе к сайту: {e}")
        raise Exception(f"Ошибка при запросе к сайту: {e}")


def get_event_description(event_url: str) -> str:
    """
    Получает описание события с детальной страницы
    """
    try:
        response = requests.get(event_url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        description_elem = soup.select_one(".event_detail .descr")
        
        if description_elem:
            return description_elem.text.strip()
        return ""
    except Exception as e:
        logger.error(f"Ошибка при получении описания события: {e}")
        return ""


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
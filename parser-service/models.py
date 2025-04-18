from datetime import datetime
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime
from database import Base


# SQLAlchemy модель для таблицы в базе данных
class EventDB(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    date = Column(String)
    time = Column(String)
    price = Column(String)
    place = Column(String)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)


# Pydantic модели для API
class EventBase(BaseModel):
    title: str
    date: str
    time: str
    price: str = ""
    place: str
    image_url: str = ""


class EventCreate(EventBase):
    pass


class Event(EventBase):
    id: int = None
    created_at: datetime = None
    
    class Config:
        from_attributes = True 
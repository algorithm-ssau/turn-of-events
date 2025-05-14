import React, { useState, useEffect } from 'react';
import EventCard from '../EventCard/EventCard';
import { Carousel } from 'react-bootstrap';
import './UpcomingEvents.css';

const UpcomingEvents = ({ title = "Предстоящие события", count = 9 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  
  // Создаем массив событий на основе переданного количества
  useEffect(() => {
    const generateEvents = () => {
      return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        title: `Событие ${index + 1}`,
        date: `${Math.floor(Math.random() * 30) + 1} марта 2023`,
        location: `Место проведения ${index + 1}`,
        description: `Описание события ${index + 1}. Здесь будет размещена полная информация о событии.`
      }));
    };
    
    setEvents(generateEvents());
  }, [count]);

  // Обновляем видимые карточки при изменении активного индекса или размеров экрана
  useEffect(() => {
    const updateVisibleCards = () => {
      if (events.length === 0) return;
      
      const totalCards = events.length;
      const leftIndex = (activeIndex - 1 + totalCards) % totalCards;
      const centerIndex = activeIndex;
      const rightIndex = (activeIndex + 1) % totalCards;
      
      let cards = [];
      
      // Определяем количество видимых карточек в зависимости от размера экрана
      if (window.innerWidth <= 576) {
        // Мобильные - 1 карточка
        cards = [
          { event: events[centerIndex], index: centerIndex, position: 'active' }
        ];
      } else if (window.innerWidth <= 768) {
        // Планшеты - 2 карточки
        cards = [
          { event: events[centerIndex], index: centerIndex, position: 'active' },
          { event: events[rightIndex], index: rightIndex, position: 'right' }
        ];
      } else {
        // Десктоп - 3 карточки
        cards = [
          { event: events[leftIndex], index: leftIndex, position: 'left' },
          { event: events[centerIndex], index: centerIndex, position: 'active' },
          { event: events[rightIndex], index: rightIndex, position: 'right' }
        ];
      }
      
      setVisibleCards(cards);
    };
    
    updateVisibleCards();
    
    // Добавляем слушатель изменения размера окна
    window.addEventListener('resize', updateVisibleCards);
    return () => {
      window.removeEventListener('resize', updateVisibleCards);
  };
  }, [activeIndex, events]);

  // Обработчик переключения на следующую карточку
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  // Обработчик переключения на предыдущую карточку
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  // Обработчик выбора индикатора
  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="upcoming-events-section">
      <h2 className="section-title">{title}</h2>
      <div className="carousel-container">
        <div className="single-row-carousel">
          <div className="carousel-slide">
            <div className="visible-cards">
              {visibleCards.map((item) => (
                <div 
                  key={item.index} 
                  className={`carousel-card ${item.position === 'active' ? 'active' : ''}`}
          >
                  <EventCard 
                    title={item.event.title}
                    date={item.event.date}
                    location={item.event.location}
                    description={item.event.description}
                  />
              </div>
            ))}
          </div>
        </div>
        
          {/* Кастомные кнопки навигации */}
          <button 
            className="carousel-control-prev" 
            onClick={handlePrev}
            aria-label="Предыдущий слайд"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
        <button
            className="carousel-control-next" 
            onClick={handleNext}
            aria-label="Следующий слайд"
        >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
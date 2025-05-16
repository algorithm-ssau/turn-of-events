import React, { useState, useEffect } from 'react';
import EventCard from '../EventCard/EventCard';
import axios from 'axios';
import './UpcomingEvents.css';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEvents(events, maxCount) {
  if (!Array.isArray(events) || events.length === 0) return [];
  const count = Math.min(getRandomInt(1, Math.min(maxCount, events.length)), events.length);
  const shuffled = [...events].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const UpcomingEvents = ({ title = "Ближайшие мероприятия", maxCount = 10 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/events/upcoming');
        const allEvents = Array.isArray(response.data) ? response.data : [];
        const randomEvents = getRandomEvents(allEvents, maxCount);
        setEvents(randomEvents);
      } catch (err) {
        setError('Ошибка загрузки ближайших мероприятий');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [maxCount]);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (events.length === 0) return;
      const totalCards = events.length;
      const leftIndex = (activeIndex - 1 + totalCards) % totalCards;
      const centerIndex = activeIndex;
      const rightIndex = (activeIndex + 1) % totalCards;
      let cards = [];
      if (window.innerWidth <= 576) {
        cards = [
          { event: events[centerIndex], index: centerIndex, position: 'active' }
        ];
      } else if (window.innerWidth <= 768) {
        cards = [
          { event: events[centerIndex], index: centerIndex, position: 'active' },
          { event: events[rightIndex], index: rightIndex, position: 'right' }
        ];
      } else {
        cards = [
          { event: events[leftIndex], index: leftIndex, position: 'left' },
          { event: events[centerIndex], index: centerIndex, position: 'active' },
          { event: events[rightIndex], index: rightIndex, position: 'right' }
        ];
      }
      setVisibleCards(cards);
    };
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => {
      window.removeEventListener('resize', updateVisibleCards);
    };
  }, [activeIndex, events]);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % events.length);
  };
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  if (loading) return null;
  if (error || events.length === 0) return null;

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
                    id={item.event.id}
                    title={item.event.title}
                    date={item.event.date}
                    location={item.event.place}
                    description={item.event.description}
                    imageUrl={item.event.imageUrl}
                  />
                </div>
              ))}
            </div>
          </div>
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
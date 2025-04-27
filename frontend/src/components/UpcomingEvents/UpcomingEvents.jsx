import './UpcomingEvents.css';
import EventCard from '../EventCard/EventCard';
import { useRef, useState, useEffect } from 'react';

const UpcomingEvents = ({ title, count }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container.scrollWidth > container.clientWidth) {
      setShowRightArrow(true);
    }
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.upcoming-event-card').offsetWidth + 20; // Ширина карточки + gap
    container.scrollBy({
      left: direction === 'right' ? cardWidth : -cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="upcoming-events-section">
      <h2>{title}</h2>
      <div className="upcoming-events-container">
        {showLeftArrow && (
          <button
            className="scroll-button left"
            onClick={() => scroll('left')}
          >
            &#8592;
          </button>
        )}
        <div
          className="upcoming-events"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {Array(count)
            .fill()
            .map((_, index) => (
              <EventCard key={index} className="upcoming-event-card" customClass="upcoming-event-card" />
            ))}
        </div>
        {showRightArrow && (
          <button
            className="scroll-button right"
            onClick={() => scroll('right')}
          >
            &#8594;
          </button>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
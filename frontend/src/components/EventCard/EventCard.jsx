import { Card } from 'react-bootstrap';
import './EventCard.css';

const EventCard = ({ title, date, location, description, customClass }) => {
    const isUpcomingEvent = customClass?.includes('upcoming-event-card');
    
    const handleCardClick = () => {
        // Здесь будет логика перехода на страницу мероприятия
        console.log('Переход на страницу мероприятия');
    };
    
    return (
        <Card className={`event-card ${customClass || ''}`} onClick={handleCardClick}>
            <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
            <Card.Body>
                <Card.Title>{title || 'Название мероприятия'}</Card.Title>
                <div className="event-details">
                    <div className="event-date">
                        <i className="calendar-icon">📅</i>
                        <span>{date || '01.01.2024'}</span>
                    </div>
                    <div className="event-location">
                        <i className="location-icon">📍</i>
                        <span>{location || 'Кампус университета'}</span>
                    </div>
                </div>
                <Card.Text>
                    {description || 'Подробное описание предстоящего мероприятия.'}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default EventCard;
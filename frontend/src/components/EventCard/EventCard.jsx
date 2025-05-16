import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';

const EventCard = ({ id, title, date, location, description, imageUrl, customClass }) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        if (id) {
            navigate(`/event/${id}`);
        }
    };
    
    return (
        <Card className={`event-card ${customClass || ''}`} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <Card.Img variant="top" src={imageUrl || "https://via.placeholder.com/300x200"} />
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
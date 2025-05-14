import { Card } from 'react-bootstrap';
import './cardd.css';

const Cardd = ({ title, date, location, description, customClass }) => {
    //const navigate = useNavigate();
    //const eventId = title?.match(/\d+/)?.[0] || Math.floor(Math.random() * 100 + 1);

    const handleCardClick = () => {
       // navigate(`/event/${eventId}`);
    };

    return (
        <Card className={`event-card ${customClass || ''}`} onClick={handleCardClick}>
            <Card.Img variant="top" src="https://via.placeholder.com/300x200" style={{width : '300px', height : '200px'}} />
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

export default Cardd;
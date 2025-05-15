import { Card } from 'react-bootstrap';
import './cardd.css';

const Cardd = ({ title, date, location, description,img,handleCardClick }) => {
    //const navigate = useNavigate();
    //const eventId = title?.match(/\d+/)?.[0] || Math.floor(Math.random() * 100 + 1);


    return (
        <Card className={`event-card`} onClick={handleCardClick}>
            <Card.Img variant="top" src={img || './img.jpg'} style={{ objectFit: 'cover',
            width: '200px',
    height: '200px'}} />
            <Card.Body>
                <Card.Title>{title || 'Название мероприятия'}</Card.Title>
                <div className="event-details">
                    <div className="event-date">
                        <i className="calendar-icon">📅</i>
                        <span>{date || '01.01.2025'}</span>
                    </div>
                    <div className="event-location">
                        <i className="location-icon">📍</i>
                        <span>{location || 'Адрес мероприятия'}</span>
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
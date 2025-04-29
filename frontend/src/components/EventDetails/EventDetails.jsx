import './EventDetails.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventMeta = ({ date, time, location }) => (
    <div className="event-meta">
        <div className="event-date-time">
            <span className="event-date">{date}</span>
            <span className="event-time">{time}</span>
        </div>
        <div className="event-location">{location}</div>
    </div>
);

const EventInfo = ({ organizer, capacity, registeredCount, availableSeats }) => (
    <div className="event-additional-info">
        <div className="info-item"><strong>Организатор:</strong> {organizer}</div>
        <div className="info-item"><strong>Вместимость:</strong> {capacity} человек</div>
        <div className="info-item"><strong>Зарегистрировано:</strong> {registeredCount} человек</div>
        <div className="info-item"><strong>Свободных мест:</strong> {availableSeats} мест</div>
    </div>
);

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const capacity = Math.floor(Math.random() * 100 + 50);
            const registeredCount = Math.floor(Math.random() * 50);
            
            setEvent({
                id,
                title: `Мероприятие ${id}`,
                date: new Date(Date.now() + Math.random() * 10000000000).toLocaleDateString('ru-RU'),
                time: `${Math.floor(Math.random() * 12 + 10)}:00`,
                location: 'Москва, ул. Примерная, д. 123',
                description: 'Подробное описание мероприятия. Здесь может быть размещена любая информация о данном событии, включая программу, список участников и другие детали.',
                organizer: 'Организатор мероприятия',
                image: `https://source.unsplash.com/random/800x600?event&sig=${id}`,
                capacity,
                registeredCount,
                availableSeats: capacity - registeredCount
            });
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return <div className="event-details-container"><div className="event-details-loading">Загрузка...</div></div>;
    }

    return (
        <div className="event-details-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Назад</button>
            
            <div className="event-details-header">
                <h1>{event.title}</h1>
                <EventMeta date={event.date} time={event.time} location={event.location} />
            </div>
            
            <div className="event-details-content">
                <div className="event-details-image">
                    <img src={event.image} alt={event.title} />
                </div>
                
                <div className="event-details-info">
                    <div className="event-description">
                        <h2>Описание</h2>
                        <p>{event.description}</p>
                    </div>
                    <EventInfo 
                        organizer={event.organizer}
                        capacity={event.capacity}
                        registeredCount={event.registeredCount}
                        availableSeats={event.availableSeats}
                    />
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
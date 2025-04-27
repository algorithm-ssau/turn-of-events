import './EventDetails.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be a fetch to an API
        // For now, we'll simulate loading event data
        setTimeout(() => {
            setEvent({
                id,
                title: `Мероприятие ${id}`,
                date: new Date(Date.now() + Math.random() * 10000000000).toLocaleDateString('ru-RU'),
                time: `${Math.floor(Math.random() * 12 + 10)}:00`,
                location: 'Москва, ул. Примерная, д. 123',
                description: 'Подробное описание мероприятия. Здесь может быть размещена любая информация о данном событии, включая программу, список участников и другие детали.',
                organizer: 'Организатор мероприятия',
                image: `https://source.unsplash.com/random/800x600?event&sig=${id}`,
                capacity: Math.floor(Math.random() * 100 + 50),
                registeredCount: Math.floor(Math.random() * 50),
            });
            setLoading(false);
        }, 500);
    }, [id]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleRegister = () => {
        alert('Вы успешно зарегистрированы на мероприятие!');
    };

    if (loading) {
        return (
            <div className="event-details-container">
                <div className="event-details-loading">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="event-details-container">
            <button className="back-button" onClick={handleGoBack}>← Назад</button>
            
            <div className="event-details-header">
                <h1>{event.title}</h1>
                <div className="event-meta">
                    <div className="event-date-time">
                        <span className="event-date">{event.date}</span>
                        <span className="event-time">{event.time}</span>
                    </div>
                    <div className="event-location">{event.location}</div>
                </div>
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
                    
                    <div className="event-additional-info">
                        <div className="info-item">
                            <strong>Организатор:</strong> {event.organizer}
                        </div>
                        <div className="info-item">
                            <strong>Вместимость:</strong> {event.capacity} человек
                        </div>
                        <div className="info-item">
                            <strong>Зарегистрировано:</strong> {event.registeredCount} человек
                        </div>
                    </div>
                    
                    <div className="event-registration">
                        <button className="register-button" onClick={handleRegister}>
                            Зарегистрироваться
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails; 
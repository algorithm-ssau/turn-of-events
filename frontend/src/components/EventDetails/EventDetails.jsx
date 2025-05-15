import './EventDetails.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventMeta = ({ date, time, location }) => (
    <div className="event-meta">
        <div className="event-date-time">
            <span className="event-date">{date}</span>
            <span className="event-time">{time}</span>
        </div>
        <div className="event-location">{location}</div>
    </div>
);

const EventInfo = ({ genre, duration, director, price, link }) => (
    <div className="event-additional-info">
        {genre && <div className="info-item"><strong>Жанр:</strong> {genre}</div>}
        {duration && <div className="info-item"><strong>Длительность:</strong> {duration}</div>}
        {director && <div className="info-item"><strong>Режиссёр:</strong> {director}</div>}
        {price && <div className="info-item"><strong>Цена:</strong> {price} ₽</div>}
        {link && <div className="info-item"><a href={link} target="_blank" rel="noopener noreferrer">Ссылка на событие</a></div>}
    </div>
);

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        axios.get(`/api/events/${id}`)
            .then(res => {
                setEvent(res.data);
            })
            .catch(() => {
                setError('Ошибка загрузки данных о мероприятии');
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <div className="event-details-container"><div className="event-details-loading">Загрузка...</div></div>;
    }
    if (error) {
        return <div className="event-details-container"><div className="event-details-loading" style={{color:'red'}}>{error}</div></div>;
    }
    if (!event) return null;

    return (
        <div className="event-details-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Назад</button>
            
            <div className="event-details-header">
                <h1>{event.title}</h1>
                <EventMeta date={event.date} time={event.time} location={event.place} />
            </div>
            
            <div className="event-details-content">
                <div className="event-details-image">
                    <img src={event.imageUrl || 'https://via.placeholder.com/800x600?event'} alt={event.title} />
                </div>
                
                <div className="event-details-info">
                    <div className="event-description">
                        <h2>Описание</h2>
                        <p>{event.description}</p>
                    </div>
                    <EventInfo 
                        genre={event.genre}
                        duration={event.duration}
                        director={event.director}
                        price={event.price}
                        link={event.link}
                    />
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
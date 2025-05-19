import React from "react";
import './EventDetails.css';

function formatDate(dateStr, timeStr) {
    if (!dateStr) return "—";
    const date = new Date(dateStr + (timeStr ? 'T' + timeStr : ''));
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }) +
        (timeStr ? `, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}` : '');
}

function EventDetails({ event, onBack }) {
    if (!event) return null;
    return (
        <div className="event-details-card animate-in">
            <button className="event-details-back" onClick={onBack}>
                ← Назад
            </button>
            <div className="event-details-main">
                <div className="event-details-img-wrap">
                    <img
                        className="event-details-img"
                        src={event.img || event.imageUrl || './no-image.png'}
                        alt={event.title}
                        onError={e => e.target.src = './no-image.png'}
                    />
                </div>
                <div className="event-details-info">
                    <h2 className="event-details-title">{event.title || 'Без названия'}</h2>
                    <div className="event-details-row">
                        <span className="event-details-icon">📅</span>
                        <span>{formatDate(event.date, event.time)}</span>
                    </div>
                    {event.place || event.location ? (
                        <div className="event-details-row">
                            <span className="event-details-icon">📍</span>
                            <span>{event.place || event.location}</span>
                        </div>
                    ) : null}
                    {event.price ? (
                        <div className="event-details-row">
                            <span className="event-details-icon">💸</span>
                            <span>{event.price} ₽</span>
                        </div>
                    ) : null}
                    {event.genre ? (
                        <div className="event-details-row">
                            <span className="event-details-icon">🎭</span>
                            <span>{event.genre}</span>
                        </div>
                    ) : null}
                    {event.duration ? (
                        <div className="event-details-row">
                            <span className="event-details-icon">⏱️</span>
                            <span>{event.duration}</span>
                        </div>
                    ) : null}
                    {event.director ? (
                        <div className="event-details-row">
                            <span className="event-details-icon">🎬</span>
                            <span>{event.director}</span>
                        </div>
                    ) : null}
                    {event.link ? (
                        <div className="event-details-row">
                            <span className="event-details-icon">🔗</span>
                            <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-details-link">{event.link}</a>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="event-details-desc-block">
                <div className="event-details-desc-title">Описание</div>
                <div className="event-details-desc">{event.description || '—'}</div>
            </div>
        </div>
    );
}

export default EventDetails;

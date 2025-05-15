import React from "react";

function EventDetails({ event, onBack }) {
    return (
        <div style={{padding: 32}}>
            <button onClick={onBack} style={{marginBottom: 24, background:'#87D2A7', color:'#0F114B', border:'none', borderRadius:8, padding:'10px 20px', fontWeight:600, fontSize:15, cursor:'pointer'}}>Назад</button>
            <h2 style={{marginBottom: 16}}>{event.title}</h2>
            <img src={event.img || event.imageUrl} alt={event.title} style={{width: 220, height: 220, objectFit: 'cover', borderRadius: 16, marginBottom: 24}} />
            <div><b>Дата:</b> {event.date} {event.time && <span>в {event.time}</span>}</div>
            <div><b>Место:</b> {event.location || event.place}</div>
            <div><b>Цена:</b> {event.price} ₽</div>
            <div><b>Жанр:</b> {event.genre}</div>
            <div><b>Длительность:</b> {event.duration}</div>
            <div><b>Режиссёр:</b> {event.director}</div>
            <div><b>Ссылка:</b> <a href={event.link} target="_blank" rel="noopener noreferrer">{event.link}</a></div>
            <div style={{marginTop: 16}}><b>Описание:</b><br />{event.description}</div>
        </div>
    );
}

export default EventDetails;

import React from "react";
import Cardd from "./Card.jsx";
import { useNavigate } from 'react-router-dom';

function EventsList({ events }) {
    const navigate = useNavigate();
    return (
        <>
            <header>
                <img className="logoimg" src="./logo.png" />
                <div style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', display: 'inline-block' }}>
                    Оборот событий
                </div>
                <div className="profile-icon">
                    <img
                        src='./icons8-гость-мужчина-48.png'
                        alt="Профиль"
                        className="profile-image"
                    />
                </div>
            </header>
            <p style={{ color: 'black', padding: '0 0 0 20px', fontSize: '20px' }}>Созданные Вами события:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <Cardd title='Создать мероприятие' date=' ' location=' ' description=' ' handleCardClick={() => { navigate(`/organizer/create`); }} img='./create.jpg' />
                {events.map((event, index) => (
                    <Cardd key={index} {...event} />
                ))}
            </div>
        </>
    );
}

export default EventsList;

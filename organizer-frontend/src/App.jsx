import './App.css';
import React from "react";
import Cardd from "./compts/cardd.jsx";
import { Col } from 'react-bootstrap';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const EventBox = ({ imgg, text }) => {
    return (
        <div style={{
            width: "300px",
            height: "400px",
            background: "#87D2A7",
            //border: "2px solid gray",
            borderRadius: "40px",
            margin: "40px",
            color: "black",
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
            <img alt="it sucks((" src={imgg} style={{
                width: "300px",
                height: "300px",
                borderRadius: "38px 38px 0px 0px"
            }} />
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}> {text}</div>
        </div>
    );
};
export default function App() {
    const [events, setEvents] = useState([
        {
            title: 'Концерт',
            date: '10.06.2025',
            location: 'клуб А',
            description: 'Выступление группы XYZ',
            img: './concert.webp',
        },
        {
            title: 'Выставка',
            date: '15.06.2025',
            location: 'музей B',
            description: 'Современные технологии',
            img: './vist.webp',
        },
        {
            title: 'Митап',
            date: '20.06.2025',
            location: 'коворкинг С',
            description: 'IT-сообщество: встреча',
            img: './itmeet.webp',
        },
    ]);
    return (
        <Router>
            <Routes>
                <Route path="/organizer" element={<Mainn events={events} />} />
                <Route path="/organizer/create" element={<Creats events={events} setEvents={setEvents} />} />
            </Routes>
        </Router>
    );
}

function Mainn({events }) {
    const navigate = useNavigate();
    
    return (<>
        <header><img className="logoimg" src="./logo.png"></img>
            <div style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',display:'inline-block'} }>
                Оборот           событий
            </div>
            <div className="profile-icon">
                <img
                    src='./icons8-гость-мужчина-48.png'
                    alt="Профиль"
                    className="profile-image"
                />
            </div>
        </header>
            <p style={{ color: 'black', padding:'0 0 0 20px', fontSize:'20px'} }>Созданные Вами события:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <Cardd title='Создать мероприятие' date=' ' location=' ' description=' ' handleCardClick={() => { navigate(`/organizer/create`); }} img='./create.jpg' />
                {events.map((event, index) => (
                    <Cardd key={index} {...event} />
                ))}
                {/*<Cardd title='fs' date='01.02.2025' location='f' description='fsd' />*/}
                {/*<Cardd img='./i.webp' />*/}
                {/*<Cardd />*/}
                {/*<Cardd />*/}
                {/*<Cardd />*/}
                {/*<Cardd />*/}
                {/*<Cardd />*/}
                {/*<Cardd />*/}
                {/*<Cardd />*/}
            {/*<EventBox imgg={imgcr} text="создать мероприятие" />*/}
            {/*<EventBox imgg={img} text="одно крутое мероприятие"  />*/}
            {/*<EventBox imgg={img2} text="второе крутое мероприятие" />*/}
            {/*<EventBox imgg={img3} text="еще одно мероприятие" />*/}
        </div>
    </>
    )
}
function Creats({events,setEvents }) {
    function Q() {
        setEvents([...events, {
            title: document.getElementById('title').value,
            date: document.getElementById('date').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            img: document.getElementById('img').value,
        }]);
    }
    return (<>
        <input id="title" placeholder="Название" />
            <input id="date" type="date" />
            <input id="location" placeholder="Место проведения" />
            <input id="description" placeholder="Описание" />
            <input id="img" placeholder="URL изображения" />
        <button onClick={Q}>Добавить</button>
    </>
    );
}
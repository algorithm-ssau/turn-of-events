import './App.css';
import React from "react";
import Cardd from "./components/Card/Card.jsx";
import { Col } from 'react-bootstrap';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EventsList from "./components/EventsList.jsx";
import EventCreateForm from "./components/EventCreateForm/EventCreateForm.jsx";

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
                <Route path="/organizer" element={<EventsList events={events} />} />
                <Route path="/organizer/create" element={<EventCreateForm events={events} setEvents={setEvents} />} />
            </Routes>
        </Router>
    );
}
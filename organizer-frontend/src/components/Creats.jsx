import React from "react";

function EventCreateForm({ events, setEvents }) {
    function Q() {
        setEvents([...events, {
            title: document.getElementById('title').value,
            date: document.getElementById('date').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            img: document.getElementById('img').value,
        }]);
    }
    return (
        <>
            <input id="title" placeholder="Название" />
            <input id="date" type="date" />
            <input id="location" placeholder="Место проведения" />
            <input id="description" placeholder="Описание" />
            <input id="img" placeholder="URL изображения" />
            <button onClick={Q}>Добавить</button>
        </>
    );
}

export default EventCreateForm;

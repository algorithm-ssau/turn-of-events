import React, { useState, useEffect } from "react";
import Header from "./Header/Header.jsx";
import Sidebar from "./Sidebar/Sidebar.jsx";
import Profile from "./Profile/Profile.jsx";
import EventDetails from "./EventDetails/EventDetails.jsx";
import EventTable from "./EventTable/EventTable.jsx";
import EventCreateForm from "./EventCreateForm/EventCreateForm.jsx";
import DeleteSelectedButton from "./DeleteSelectedButton/DeleteSelectedButton.jsx";

const API_URL = `${window.location.origin.replace(/\/organizer.*/, '')}/api/events`;
const user = JSON.parse(localStorage.getItem('user'));
const userId = user?.userId;
const token = localStorage.getItem('authToken');

function EventsList({}) {
    const [events, setEvents] = useState([]);
    const [activeTab, setActiveTab] = useState('events');
    const [selected, setSelected] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEventIdx, setSelectedEventIdx] = useState(null);

    useEffect(() => {
        if (activeTab !== 'events' || !userId) return;
        fetch(`${API_URL}/user/${userId}`)
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(() => setEvents([]));
    }, [activeTab, userId]);

    const handleAddEvent = async (newEvent) => {
        if (!userId || !token) return;
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ...newEvent, userId })
        });
        if (response.ok) {
            const created = await response.json();
            setEvents(prev => [...prev, created]);
        }
    };

    const handleSelect = (index) => {
        setSelected((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(events.map((_, idx) => idx));
        } else {
            setSelected([]);
        }
    };

    const handleDeleteSelected = async () => {
        for (const idx of selected) {
            const event = events[idx];
            await fetch(`${API_URL}/${event.id}`, { method: 'DELETE' });
        }
        setEvents(events.filter((_, idx) => !selected.includes(idx)));
        setSelected([]);
    };

    const handleDeleteEvent = async (eventId) => {
        if (!eventId || !token) return;
        await fetch(`${API_URL}/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setEvents(events => events.filter(ev => ev.id !== eventId));
        setSelected(selected => selected.filter(idx => events[idx]?.id !== eventId));
    };

    return (
        <>
            <Header />
            <div style={{ display: 'flex', marginTop: 24 }}>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <div style={{ flex: 1 }}>
                    {activeTab === 'profile' && <Profile />}
                    {activeTab === 'events' && (
                        selectedEventIdx !== null ? (
                            <EventDetails event={events[selectedEventIdx]} onBack={() => setSelectedEventIdx(null)} />
                        ) : (
                            <div style={{padding: 32}}>
                                <h2 style={{marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    Мои события
                                    <button
                                        style={{
                                            padding: '12px 24px',
                                            background: '#87D2A7',
                                            color: '#0F114B',
                                            border: 'none',
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            fontSize: 16,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                                        }}
                                        onClick={() => setShowModal(true)}
                                    >
                                        Создать мероприятие
                                    </button>
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 16 }}>
                                    <span>Выбрать все</span>
                                    <DeleteSelectedButton
                                        disabled={selected.length === 0}
                                        onClick={handleDeleteSelected}
                                        selectedCount={selected.length}
                                    />
                                </div>
                                <EventTable
                                    events={events}
                                    selected={selected}
                                    onSelect={handleSelect}
                                    onSelectAll={handleSelectAll}
                                    onRowClick={setSelectedEventIdx}
                                />
                                {showModal && (
                                    <EventCreateForm onAdd={handleAddEvent} onClose={() => setShowModal(false)} />
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default EventsList;

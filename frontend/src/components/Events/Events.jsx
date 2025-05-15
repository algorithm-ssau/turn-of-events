import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EventCard from '../EventCard/EventCard';
import axios from 'axios';
import './Events.css';

const Events = ({ title }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/events');
                console.log('Ответ сервера /api/events:', response.data);
                if (response.data && Array.isArray(response.data.content)) {
                  setEvents(response.data.content);
                  setError(null);
                } else {
                  setEvents([]);
                  setError('Некорректный формат ответа от сервера');
                }
            } catch (err) {
                setError('Ошибка загрузки мероприятий');
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <section>
            <h2 className="section-title">{title}</h2>
            <div className="events">
                {loading && <div>Загрузка...</div>}
                {error && <div style={{color: 'red'}}>{error}</div>}
                {!loading && !error && events.length === 0 && (
                  <div style={{textAlign: 'center', color: '#888', margin: '30px 0'}}>
                    На данный момент нет запланированных мероприятий
                  </div>
                )}
                {!loading && !error && events.length > 0 && (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {events.map((event) => (
                            <Col key={event.id}>
                                <EventCard
                                    id={event.id}
                                    title={event.title}
                                    date={event.date}
                                    location={event.place}
                                    description={event.description}
                                    customClass=""
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </section>
    );
};

export default Events;
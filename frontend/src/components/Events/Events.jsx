import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EventCard from '../EventCard/EventCard';
import axios from 'axios';
import './Events.css';

const Events = ({ title }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                // В запросе нумерация страниц с 0
                const response = await axios.get(`/api/events?page=${page - 1}&size=9&sortBy=id&sortDir=asc`);
                // Ожидаем, что response.data.content - массив мероприятий, response.data.totalPages - всего страниц
                if (response.data && Array.isArray(response.data.content)) {
                  setEvents(response.data.content);
                  setTotalPages(response.data.totalPages || 1);
                  setError(null);
                } else {
                  setEvents([]);
                  setTotalPages(1);
                  setError('Некорректный формат ответа от сервера');
                }
            } catch (err) {
                setError('Ошибка загрузки мероприятий');
                setEvents([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [page]);

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    };

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
                    <>
                      <Row xs={1} md={2} lg={3} className="g-4">
                          {events.map((event) => (
                              <Col key={event.id}>
                                  <EventCard
                                      id={event.id}
                                      title={event.title}
                                      date={event.date}
                                      location={event.place}
                                      description={event.description}
                                      imageUrl={event.imageUrl}
                                      customClass=""
                                  />
                              </Col>
                          ))}
                      </Row>
                      {/* Пагинация */}
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} style={{marginRight: 8}}>
                          Назад
                        </button>
                        <span style={{margin: '0 12px'}}>Страница {page} из {totalPages}</span>
                        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                          Вперёд
                        </button>
                      </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Events;
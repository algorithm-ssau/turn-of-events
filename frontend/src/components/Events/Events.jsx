import { Container, Row, Col } from 'react-bootstrap';
import EventCard from '../EventCard/EventCard';
import './Events.css';

const Events = ({ title, count }) => {
    return (
        <section>
            <h2 className="section-title">{title}</h2>
            <div className="events">
                <Row xs={1} md={2} lg={3} className="g-4">
                {Array(count).fill().map((_, index) => (
                        <Col key={index}>
                            <EventCard />
                        </Col>
                ))}
                </Row>
            </div>
        </section>
    );
};

export default Events;
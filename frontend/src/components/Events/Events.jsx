import './Events.css'
import EventCard from '../EventCard/EventCard'

const Events = ({ title, count }) => {
    return (
        <section>
            <h2>{title}</h2>
            <div className="events">
                {Array(count).fill().map((_, index) => (
                    <EventCard key={index} />
                ))}
            </div>
        </section>
    );
};

export default Events;
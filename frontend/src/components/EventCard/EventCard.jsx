import './EventCard.css'
const EventCard = ({ customClass }) => {
    return (
        <div className={`event-card ${customClass || ''}`}></div>
    );
};

export default EventCard;
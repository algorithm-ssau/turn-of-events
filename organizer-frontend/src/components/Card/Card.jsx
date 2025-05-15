import React from "react";
import './Card.css';

function Card({ title, date, location, description, handleCardClick, img }) {
    return (
        <div className="card" onClick={handleCardClick}>
            <img className="card-img" src={img} alt={title} />
            <div className="card-content">
                <h3>{title}</h3>
                <p>{date}</p>
                <p>{location}</p>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default Card;

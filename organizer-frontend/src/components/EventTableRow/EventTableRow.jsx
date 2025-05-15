import React from "react";

function EventTableRow({ event, index, selected, onSelect, onClick }) {
    return (
        <tr style={{borderBottom: '1px solid #eee', cursor: 'pointer'}} onClick={() => onClick(index)}>
            <td style={{padding: '10px'}} onClick={e => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={selected.includes(index)}
                    onChange={() => onSelect(index)}
                />
            </td>
            <td style={{padding: '10px', color: '#1976d2', textDecoration: 'underline'}}>{event.title}</td>
            <td style={{padding: '10px'}}>{event.date}</td>
            <td style={{padding: '10px'}}>{event.location || event.place}</td>
            <td style={{padding: '10px'}}>{event.description}</td>
            <td style={{padding: '10px'}}>
                <img src={event.img || event.imageUrl} alt={event.title} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8}} />
            </td>
        </tr>
    );
}

export default EventTableRow;

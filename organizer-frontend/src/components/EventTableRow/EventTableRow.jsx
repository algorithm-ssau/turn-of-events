import React from "react";

function EventTableRow({ event, index, selected, onSelect, onClick, onDelete }) {
    // Проверка на пустой event
    if (!event) return null;
    return (
        <tr style={{borderBottom: '1px solid #eee', cursor: 'pointer', color: '#222'}} onClick={() => onClick(index)}>
            <td style={{padding: '10px'}} onClick={e => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={selected.includes(index)}
                    onChange={() => onSelect(index)}
                />
            </td>
            <td style={{padding: '10px', color: '#1976d2', textDecoration: 'underline'}}>{event.title || '-'}</td>
            <td style={{padding: '10px', color: '#222'}}>{event.date || '-'}</td>
            <td style={{padding: '10px', color: '#222'}}>{event.place || event.location || '-'}</td>
            <td style={{padding: '10px', maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#222'}}>{event.description || '-'}</td>
            <td style={{padding: '10px', display: 'flex', alignItems: 'center', gap: 8}}>
                {event.img || event.imageUrl ? (
                    <img src={event.img || event.imageUrl} alt={event.title} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8}} />
                ) : (
                    <span style={{color:'#aaa'}}>Нет изображения</span>
                )}
            </td>
            <td style={{padding: '10px'}} onClick={e => e.stopPropagation()}>
                <button
                    style={{background: '#e57373', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 500}}
                    onClick={() => onDelete && onDelete(event.id)}
                    title="Удалить мероприятие"
                >Удалить</button>
            </td>
        </tr>
    );
}

export default EventTableRow;

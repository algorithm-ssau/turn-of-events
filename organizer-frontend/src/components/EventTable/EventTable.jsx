import React from "react";
import EventTableRow from "../EventTableRow/EventTableRow.jsx";

function EventTable({ events, selected, onSelect, onSelectAll, onRowClick, onDelete }) {
    return (
        <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <thead style={{background: '#87D2A7', color: '#0F114B'}}>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            checked={selected.length === events.length && events.length > 0}
                            onChange={onSelectAll}
                        />
                    </th>
                    <th style={{padding: '12px', textAlign: 'left'}}>Название</th>
                    <th style={{padding: '12px', textAlign: 'left'}}>Дата</th>
                    <th style={{padding: '12px', textAlign: 'left'}}>Место</th>
                    <th style={{padding: '12px', textAlign: 'left'}}>Описание</th>
                    <th style={{padding: '12px', textAlign: 'left'}}>Изображение</th>
                    <th style={{padding: '12px', textAlign: 'left'}}>Действия</th>
                </tr>
            </thead>
            <tbody>
                {events.map((event, index) => (
                    <EventTableRow
                        key={index}
                        event={event}
                        index={index}
                        selected={selected}
                        onSelect={onSelect}
                        onClick={onRowClick}
                        onDelete={onDelete}
                    />
                ))}
            </tbody>
        </table>
    );
}

export default EventTable;

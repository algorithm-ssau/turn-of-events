import React, { useState } from "react";

function EventCreateForm({ onAdd, onClose }) {
    const [form, setForm] = useState({
        title: '',
        date: '',
        time: '',
        price: '',
        place: '',
        imageUrl: '',
        genre: '',
        duration: '',
        director: '',
        link: '',
        description: ''
    });
    const [show, setShow] = useState(true);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAdd({
            id: Date.now(),
            ...form
        });
        setShow(false);
        if (onClose) onClose();
    };

    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(135,210,167,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}>
            <form onSubmit={handleSubmit} style={{
                background: '#fff',
                borderRadius: 24,
                padding: 36,
                minWidth: 350,
                maxWidth: 500,
                boxShadow: '0 4px 24px rgba(135,210,167,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                position: 'relative',
                border: '2px solid #87D2A7'
            }}>
                <button type="button" onClick={() => { setShow(false); if (onClose) onClose(); }} style={{position:'absolute',top:12,right:16,fontSize:22,background:'none',border:'none',cursor:'pointer',color:'#87D2A7'}}>&times;</button>
                <h2 style={{marginBottom:8, color:'#0F114B'}}>Создать мероприятие</h2>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Название" required style={{border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                <div style={{display:'flex',gap:8}}>
                  <input name="date" type="date" value={form.date} onChange={handleChange} placeholder="Дата" required style={{flex:1,border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                  <input name="time" type="time" value={form.time} onChange={handleChange} placeholder="Время" required style={{flex:1,border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <input name="price" value={form.price} onChange={handleChange} placeholder="Цена" required style={{flex:1,border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                  <input name="place" value={form.place} onChange={handleChange} placeholder="Место проведения" required style={{flex:2,border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                </div>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="URL изображения" required style={{border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                <div style={{display:'flex',gap:8}}>
                  <input name="genre" value={form.genre} onChange={handleChange} placeholder="Жанр" required style={{flex:1,border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                  <input name="duration" value={form.duration} onChange={handleChange} placeholder="Длительность" required style={{flex:1,border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                </div>
                <input name="director" value={form.director} onChange={handleChange} placeholder="Режиссёр" required style={{border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                <input name="link" value={form.link} onChange={handleChange} placeholder="Ссылка на событие" required style={{border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" rows={3} required style={{border:'1px solid #87D2A7',borderRadius:8,padding:8,background:'#fff',color:'#222'}}/>
                <button type="submit" style={{background:'#87D2A7',color:'#0F114B',border:'none',borderRadius:8,padding:'12px',fontWeight:600,fontSize:16,cursor:'pointer',marginTop:8}}>Создать</button>
            </form>
        </div>
    );
}

export default EventCreateForm;

import React from "react";

function Sidebar({ activeTab, setActiveTab }) {
    return (
        <div style={{
            minWidth: 220,
            background: '#f3f3f3',
            borderRadius: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '32px 0',
            marginLeft: 24,
            marginRight: 32,
            height: 'fit-content',
        }}>
            <button
                style={{
                    width: '80%',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '16px',
                    background: activeTab === 'profile' ? '#87D2A7' : '#fff',
                    color: '#222',
                    fontWeight: 500,
                    fontSize: 16,
                    marginBottom: 16,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                onClick={() => setActiveTab('profile')}
            >
                Профиль
            </button>
            <button
                style={{
                    width: '80%',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '16px',
                    background: activeTab === 'events' ? '#87D2A7' : '#fff',
                    color: '#222',
                    fontWeight: 500,
                    fontSize: 16,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                }}
                onClick={() => setActiveTab('events')}
            >
                Мои события
            </button>
        </div>
    );
}

export default Sidebar;

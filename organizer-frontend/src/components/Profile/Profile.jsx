import React from "react";

function Profile() {
    return (
        <div style={{ padding: 32 }}>
            <h2>Профиль</h2>
            <div style={{ marginTop: 16 }}>
                <img
                    src='./icons8-гость-мужчина-48.png'
                    alt="Профиль"
                    style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 16 }}
                />
                <div><b>Имя:</b> Гость</div>
                <div><b>Email:</b> guest@example.com</div>
                <div style={{ marginTop: 12, color: '#888' }}>(Настройки профиля в разработке)</div>
            </div>
        </div>
    );
}

export default Profile;

import React from "react";

function Header() {
    return (
        <header>
            <img className="logoimg" src="./logo.png" />
            <div style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', display: 'inline-block' }}>
                Оборот событий
            </div>
            <div className="profile-icon">
                <img
                    src='./icons8-гость-мужчина-48.png'
                    alt="Профиль"
                    className="profile-image"
                />
            </div>
        </header>
    );
}

export default Header;

import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();    const handleLogoClick = () => {
        window.location.href = '/';
    };

    return (
        <header>
            <img className="logoimg" src="./logo.png" onClick={handleLogoClick} style={{ cursor: 'pointer' }} />
            <div 
                onClick={handleLogoClick}
                style={{ 
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', 
                    display: 'inline-block', 
                    whiteSpace:'pre',
                    cursor: 'pointer'
                }}
            >
                Оборот           событий
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

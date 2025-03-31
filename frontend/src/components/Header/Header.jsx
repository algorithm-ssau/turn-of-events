import './Header.css'

const Header = () => {
    return (
        <header className="header">
            <div className="logo">Оборот Событий</div>
            <div className="search-bar">
                <input type="text" placeholder="Поиск..." />
            </div>
            <div className="profile-icon">👤</div>
        </header>
    );
};

export default Header;
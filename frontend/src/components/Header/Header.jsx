import './Header.css';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Реф для меню

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    // Если клик произошёл вне меню, закрываем его
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    // Добавляем обработчик кликов на документ
    document.addEventListener('mousedown', handleClickOutside);

    // Убираем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">Оборот событий</div>
      <div className="search-bar">
        <input type="text" placeholder="Поиск..." />
      </div>
      <div className="profile-container" ref={menuRef}>
        <div className="profile-icon" onClick={toggleMenu}>
          <img src="./public/icons8-гость-мужчина-48.png" alt="Профиль" className="profile-image" />
        </div>
        {isMenuOpen && (
          <div className="profile-menu">
            <ul>
              <li>Профиль</li>
              <li>Настройки</li>
              <li>Выход</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
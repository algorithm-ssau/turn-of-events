import { useState, useRef, useEffect } from 'react';
import { Navbar, Container, Form, Nav, NavDropdown, SplitButton, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import LoginButton from '../LoginButton/LoginButton';
import './Header.css';
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Navbar expand="lg" className="header">
          <Container fluid>
              <img className="logoimg" src="../logo.png" />
              <Navbar.Brand className="logo" href="/" style={{ whiteSpace:'pre'} }>Оборот               событий</Navbar.Brand>
        <Form className="d-flex mx-auto search-bar">
          <Form.Control
            type="search"
            placeholder="Поиск..."
            className="me-2"
            aria-label="Search"
          />
        </Form>
        {/* Условный рендеринг: кнопка "Войти" или иконка профиля */}
{isAuthenticated ? (
  <div className="profile-container" ref={menuRef} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <Dropdown show={isMenuOpen} onToggle={() => setIsMenuOpen((prev) => !prev)} className="profile-dropdown" align="start" drop="start">
      <Dropdown.Toggle
        as="span"
        id="profile-dropdown"
        style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
      <div className="profile-icon">
        <img
          src={'./icons8-гость-мужчина-48.png'}
          alt="Профиль"
          className="profile-image"
        />
      </div>
    </Dropdown.Toggle>
    <Dropdown.Menu>
      <Dropdown.Item>
        <img src="./icons8-гость-мужчина-48.png" alt="" />
        {user && user.username ? user.username : 'Имя'}
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item className="profile-right" onClick={() => { window.location.href = '/organizer'; }}>
        Профиль
      </Dropdown.Item>
      <Dropdown.Item className="profile-right">Настройки</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item className="profile-right" onClick={logout}>Выход</Dropdown.Item>
    </Dropdown.Menu>
    </Dropdown>
  </div>
) : (
          <LoginButton />
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
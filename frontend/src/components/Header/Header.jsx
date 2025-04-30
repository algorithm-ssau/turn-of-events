import { useState, useRef, useEffect } from 'react';
import { Navbar, Container, Form, Nav, NavDropdown } from 'react-bootstrap';
import './Header.css';

const Header = () => {
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
        <Navbar.Brand className="logo" href="/">Оборот событий</Navbar.Brand>
        <Form className="d-flex mx-auto search-bar">
          <Form.Control
            type="search"
            placeholder="Поиск..."
            className="me-2"
            aria-label="Search"
          />
        </Form>
        <div className="profile-container" ref={menuRef}>
          <NavDropdown 
            title={
              <div className="profile-icon">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXIiPjxwYXRoIGQ9Ik0xOSAyMXYtMmE0IDQgMCAwIDAtNC00SDlhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+" 
                  alt="Профиль" 
                  className="profile-image" 
                />
              </div>
            }
            id="basic-nav-dropdown"
            show={isMenuOpen}
            onToggle={(isOpen) => setIsMenuOpen(isOpen)}
            align="end"
            className="profile-dropdown"
          >
            <NavDropdown.Item>Профиль</NavDropdown.Item>
            <NavDropdown.Item>Настройки</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>Выход</NavDropdown.Item>
          </NavDropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
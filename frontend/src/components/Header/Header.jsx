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
                                  src={'/public/icons8-гость-мужчина-48.png'}
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
import React, { useState } from 'react';
import { Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './LoginButton.css';

const LoginButton = () => {
  const { login, register } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };
  
  const handleShow = () => {
    setIsLoginMode(true); // Всегда показываем форму входа при открытии
    setShowModal(true);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(false);
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Простая валидация
    if (!email || !password) {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Вызываем метод входа из контекста для реального API
      const result = await login({ email, password });
      
      if (result.success) {
        handleClose();
        window.location.reload(); // Перезагружаем страницу для обновления состояния авторизации
      } else {
        setErrorMessage(result.message || 'Ошибка при входе');
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка при входе. Попробуйте позже.');
      console.error('Ошибка входа:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Валидация формы регистрации
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Вызываем метод регистрации из контекста
      const result = await register({ name, email, password });
      
      if (result.success) {
        setSuccessMessage('Регистрация успешна! Теперь вы можете войти.');
        setIsLoginMode(true);
        
        // Очищаем поля формы кроме email
        setName('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(result.message || 'Ошибка при регистрации');
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка при регистрации. Попробуйте позже.');
      console.error('Ошибка регистрации:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <Form onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="Введите email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Пароль</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="Введите пароль" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>
      
      <div className="d-flex justify-content-between align-items-center">
        <Button variant="link" size="sm" className="p-0" disabled={isLoading}>
          Забыли пароль?
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">Вход...</span>
            </>
          ) : 'Войти'}
        </Button>
      </div>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form onSubmit={handleRegister}>
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Имя</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Введите ваше имя" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRegEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="Введите email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formRegPassword">
        <Form.Label>Пароль</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="Введите пароль (минимум 6 символов)" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formConfirmPassword">
        <Form.Label>Подтверждение пароля</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="Повторите пароль" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </Form.Group>
      
      <div className="d-flex justify-content-end">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ms-2">Регистрация...</span>
            </>
          ) : 'Зарегистрироваться'}
        </Button>
      </div>
    </Form>
  );

  return (
    <>
      <Button variant="outline-primary" className="login-button" onClick={handleShow}>
        Войти
      </Button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isLoginMode ? 'Вход в систему' : 'Регистрация'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          
          {isLoginMode ? renderLoginForm() : renderRegisterForm()}
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 text-center">
            {isLoginMode ? (
              <>
                <span>Нет аккаунта? </span>
                <Button variant="link" className="p-0" onClick={switchMode} disabled={isLoading}>
                  Зарегистрироваться
                </Button>
              </>
            ) : (
              <>
                <span>Уже есть аккаунт? </span>
                <Button variant="link" className="p-0" onClick={switchMode} disabled={isLoading}>
                  Войти
                </Button>
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginButton; 
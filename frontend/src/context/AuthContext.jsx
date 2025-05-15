import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

// Создаем контекст авторизации
const AuthContext = createContext();

// Провайдер контекста для управления состоянием авторизации
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }
        // Восстанавливаем user из localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
          setIsAuthenticated(true);
        }
        // Проверяем валидность токена (опционально)
        // const isValid = await authService.validateToken();
        // if (!isValid) { ... }
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Функция для входа в систему
  const login = async (credentials) => {
    try {
      // Реальная авторизация через API
      const response = await authService.login(credentials);
      setIsAuthenticated(true);
      // Формируем user из ответа
      const userObj = {
        name: response.name,
        userId: response.userId,
        username: response.username
      };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Ошибка при входе в систему' 
      };
    }
  };
  
  // Функция для выхода из системы
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  // Функция для регистрации нового пользователя
  const register = async (userData) => {
    try {
      // Реальная регистрация через API
      const response = await authService.register(userData);
      return { 
        success: true,
        user: response.user 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Ошибка при регистрации' 
      };
    }
  };
  
  // Значения, которые будут доступны в контексте
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Хук для использования контекста авторизации
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
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
        // Проверяем наличие токена в localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Проверяем валидность токена
        const isValid = await authService.validateToken();
        
        if (isValid) {
          // Получаем данные пользователя
          const userData = await authService.getCurrentUser();
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          // Если токен невалидный, пытаемся обновить его
          try {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
              const userData = await authService.getCurrentUser();
              setIsAuthenticated(true);
              setUser(userData);
            }
          } catch (refreshError) {
            console.error('Ошибка при обновлении токена:', refreshError);
          }
        }
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
      setUser(response.user);
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
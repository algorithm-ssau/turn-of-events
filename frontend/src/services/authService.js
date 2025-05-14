import axios from 'axios';

// Базовый URL API
const API_URL = 'http://localhost:8000/api/auth/';

// Настройка заголовков для токена авторизации
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Вспомогательная функция для перехвата ошибок
const handleError = (error) => {
  if (error.response) {
    // Ошибка от сервера с кодом статуса
    const message = error.response.data.message || 'Ошибка запроса';
    throw new Error(message);
  } else if (error.request) {
    // Запрос был сделан, но ответ не получен
    throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
  } else {
    // Что-то пошло не так при настройке запроса
    throw new Error('Ошибка при отправке запроса.');
  }
};

const authService = {
  // Регистрация нового пользователя
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}register`, userData);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Авторизация пользователя
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}login`, credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Выход пользователя
  logout: () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    
    // Опционально: запрос к серверу для инвалидации токена
    try {
      axios.post(`${API_URL}logout`);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  },

  // Получение данных текущего пользователя
  getCurrentUser: async () => {
    try {
      // Устанавливаем токен из localStorage
      const token = localStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
      } else {
        throw new Error('Токен авторизации не найден');
      }
      
      const response = await axios.get(`${API_URL}user`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Проверка валидности токена
  validateToken: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return false;
      }
      
      setAuthToken(token);
      const response = await axios.get(`${API_URL}validate-token`);
      return response.data.valid;
    } catch (error) {
      console.error('Ошибка при валидации токена:', error);
      return false;
    }
  },

  // Обновление токена
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return false;
      }
      
      const response = await axios.post(`${API_URL}refresh-token`, { refreshToken });
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setAuthToken(response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      return false;
    }
  }
};

export default authService; 
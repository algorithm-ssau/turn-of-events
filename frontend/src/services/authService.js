import axios from 'axios';

const API_URL = '/api/auth/';

// Вспомогательная функция для перехвата ошибок
const handleError = (error) => {
  if (error.response) {
    const message = error.response.data.message || 'Ошибка запроса';
    throw new Error(message);
  } else if (error.request) {
    throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
  } else {
    throw new Error('Ошибка при отправке запроса.');
  }
};

// Устанавливаем accessToken в заголовки axios по умолчанию
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// --- АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ ТОКЕНА ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        })
        .catch(err => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(new Error('Нет refreshToken'));
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(error);
      }
      try {
        const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        setAuthToken(accessToken);
        processQueue(null, accessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

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
      const { token, refreshToken, name, userId, username } = response.data;
      if (token) localStorage.setItem('authToken', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      setAuthToken(token);
      return { token, refreshToken, name, userId, username };
    } catch (error) {
      return handleError(error);
    }
  },

  // Обновление токена
  refresh: async (refreshToken) => {
    try {
      const response = await axios.post(`${API_URL}refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      if (accessToken) localStorage.setItem('authToken', accessToken);
      if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
      setAuthToken(accessToken);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      return handleError(error);
    }
  },

  // Выход пользователя
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setAuthToken(null);
  }
};

export default authService;
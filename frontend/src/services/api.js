import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global handling for specific status codes
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Automatic logout on token expiry/unauthorized
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }

    // Better error message extraction
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    
    // We can potentially attach the cleaned message to the error object
    error.formattedMessage = message;

    return Promise.reject(error);
  }
);

export default api;

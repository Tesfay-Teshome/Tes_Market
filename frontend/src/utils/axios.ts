import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for CSRF token
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Required for Django to recognize AJAX requests
  },
});

// Add request interceptor to get CSRF token
instance.interceptors.request.use(
  async (config) => {
    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    // If CSRF token exists, add it to headers
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth token on unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default instance;

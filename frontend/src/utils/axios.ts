import axios from 'axios';

// Get the base URL from environment variables or use a default for development
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const instance = axios.create({
  baseURL,
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

// Add response interceptor to handle token expiration and network errors
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth token on unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    } else if (!error.response) {
      // Handle network errors
      console.error('Network error:', error);
    }
    return Promise.reject(error);
  }
);

export default instance;

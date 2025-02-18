import axios from 'axios';

// Function to get CSRF token from cookie
function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Get the base URL from environment variables or use a default for development
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const instance = axios.create({
    baseURL,
    withCredentials: true, // Important for CSRF token
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Required for Django to recognize AJAX requests
        'Accept': 'application/json',  // Moved this to be consistently included
    },
});

// Add request interceptor to get CSRF and Auth token
instance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Include CSRF token for non-GET requests
        if (config.method !== 'get') {
            const csrfToken = getCookie('csrftoken');
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
let isRefreshing = false; // Flag to prevent multiple refresh requests

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Get refresh token from localStorage
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    // If there's no refresh token, redirect to login
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }

                const refreshResponse = await axios.post('/token/refresh/', {
                    refresh: refreshToken, // Send the refresh token
                }, {
                    headers: {
                        'Content-Type': 'application/json', // Ensure Content-Type is set for refresh token request
                    },
                });

                const { access } = refreshResponse.data;

                localStorage.setItem('authToken', access); // Update localStorage

                instance.defaults.headers.common['Authorization'] = `Bearer ${access}`; // Update the authorization header
                originalRequest.headers['Authorization'] = `Bearer ${access}`; // Update the original request

                return instance(originalRequest); // Retry the original request

            } catch (refreshError) {
                // If refresh fails, redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

async function getUser() {
    const response = await instance.get('/users/me/');  //Corrected API Endpoint
    return response.data; // Return the data
    // Use the response here
}

export default instance;
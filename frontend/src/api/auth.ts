import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'customer' | 'vendor';
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

const API_URL = '/api/auth';

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login/`, credentials);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to login. Please check your credentials and try again.');
  }
};

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register/`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.data?.email) {
      throw new Error(error.response.data.email[0]);
    }
    throw new Error('Failed to register. Please try again later.');
  }
};

export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  try {
    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
    return response.data;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/password/reset/`, { email });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to send password reset email. Please try again later.');
  }
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/password/reset/confirm/`, {
      token,
      password,
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to reset password. Please try again later.');
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await axios.post(`${API_URL}/token/verify/`, { token });
    return true;
  } catch (error) {
    return false;
  }
};

// Set up axios interceptors for authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const storedRefreshToken = localStorage.getItem('refresh_token');
        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }

        const { access } = await refreshToken(storedRefreshToken);
        localStorage.setItem('access_token', access);
        
        // Update the failed request's authorization header
        originalRequest.headers.Authorization = `Bearer ${access}`;
       
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout the user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

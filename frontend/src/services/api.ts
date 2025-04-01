import axios, { AxiosInstance } from 'axios';
import { store } from '@/store';
import { setUser, setTokens } from '@/store/slices/authSlice';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types';

// User type enum
export enum UserTypeEnum {
  BUYER = 'buyer',
  VENDOR = 'vendor',
  ADMINISTRATOR = 'administrator'
}

// Custom JWT payload type
interface CustomJwtPayload {
  user_type: UserTypeEnum;
  username: string;
  email: string;
  profile_image: string | null;
}

// Function to get CSRF token from cookies
const getCsrfToken = async () => {
  // First try to get from cookies
  const tokenRow = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  if (tokenRow) {
    return tokenRow.split('=')[1];
  }
  
  // If not found in cookies, try to get from the Django CSRF cookie
  const djangoCsrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  if (djangoCsrfToken) {
    return djangoCsrfToken.split('=')[1];
  }
  
  // If still not found, fetch it from the server
  try {
    const response = await axios.get(`${API_URL}/api/csrf/`, {
      withCredentials: true
    });
    return response.data.csrf_token;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw new Error('Failed to get CSRF token');
  }
};

// Function to set CSRF token in cookies
const setCsrfToken = (token: string) => {
  document.cookie = `csrftoken=${token}; path=/; SameSite=Lax`;
};

// Initialize CSRF token when the app starts
const initializeCsrfToken = async () => {
  try {
    // First try to get from existing cookie
    const existingToken = await getCsrfToken();
    if (existingToken) {
      return;
    }
    
    // If no existing token, fetch from server
    const response = await axios.get(`${API_URL}/api/csrf/`, {
      withCredentials: true
    });
    const token = response.data.csrf_token;
    setCsrfToken(token);
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
    throw error;
  }
};

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') as string;

// Extend AxiosInstance to include custom methods
interface CustomAxiosInstance extends AxiosInstance {
  createCategory: (data: FormData) => Promise<any>;
  getCategories: () => Promise<any>;
  // Add other custom methods if needed
}

// Create the axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for sending cookies
}) as CustomAxiosInstance;

// Initialize CSRF token when the app starts
initializeCsrfToken();

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      try {
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(
          `${API_URL}/api/token/refresh/`,
          { refresh: refreshToken },
          { withCredentials: true }
        );
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Get complete user data from API
        const userDataResponse = await axios.get(
          `${API_URL}/api/users/me/`,
          { 
            headers: { Authorization: `Bearer ${access}` },
            withCredentials: true
          }
        );

        // Update user state with complete user data
        store.dispatch(setUser(userDataResponse.data as User));
        store.dispatch(setTokens({ access, refresh: refreshToken }));

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: any) => {
    return await api.post('/api/auth/register/', data);
  },
  login: async (data: { email: string; password: string }) => {
    try {
      // Get CSRF token
      const csrfToken = await getCsrfToken();
      
      // Prepare the request data
      const loginData = {
        ...data,
        csrfmiddlewaretoken: csrfToken
      };
      
      // Make the login request with proper headers
      const response = await api.post('/api/auth/login/', loginData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });
      
      const { access, refresh, user } = response.data;
      
      // Update user state with complete user data
      store.dispatch(setUser(user as User));
      store.dispatch(setTokens({ access, refresh }));
      
      return response.data;
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  },
  refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
      return response.data;
    } catch (error: any) {
      console.error('Refresh token failed:', error);
      throw error;
    }
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/users/me/');
    const userData = response.data as User;
    if (!userData) {
      throw new Error('User data not found');
    }
    return userData;
  },
  updateProfile: async (data: any) => {
    const response = await api.patch('/api/users/me/', data);
    return response.data;
  },
  updateProfileImage: async (data: FormData) => {
    const response = await api.patch('/api/users/me/profile-image/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  updatePassword: async (data: any) => {
    const response = await api.patch('/api/users/me/password/', data);
    return response.data;
  },
  updateNotificationSettings: async (data: any) => {
    const response = await api.patch('/api/users/me/notifications/', data);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: (params?: any) =>
    api.get('/products/', { params }),
  
  getById: (slug: string) =>
    api.get(`/products/${slug}/`),
  
  getFeatured: () =>
    api.get('/products/featured/'),
  
  create: (data: FormData) =>
    api.post('/products/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  update: (id: string, data: FormData) =>
    api.patch(`/products/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  delete: (id: string) =>
    api.delete(`/products/${id}/`),
  
  requestApproval: (id: string) =>
    api.post(`/products/${id}/request_approval/`),
};

// Categories API
export const categoriesAPI = {
  getAll: () =>
    api.get('/categories/'),
  
  getBySlug: (slug: string) =>
    api.get(`/categories/${slug}/`),
  
  create: (data: FormData) =>
    api.post('/categories/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  update: (id: string, data: FormData) =>
    api.patch(`/categories/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  delete: (id: string) =>
    api.delete(`/categories/${id}/`),
};

// Cart API
export const cartAPI = {
  get: () =>
    api.get('/cart/'),
  
  addItem: (productId: string, quantity: number = 1) =>
    api.post('/cart/items/', { product_id: productId, quantity }),
  
  updateItem: (id: string, data: any) =>
    api.patch(`/cart/items/${id}/`, data),
  
  removeItem: (id: string) =>
    api.delete(`/cart/items/${id}/`),
  
  clear: () =>
    api.delete('/cart/'),
};

// Orders API
export const ordersAPI = {
  getAll: () =>
    api.get('/orders/'),
  
  getById: (id: string) =>
    api.get(`/orders/${id}/`),
  
  create: (data: any) =>
    api.post('/orders/', data),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status/`, { status }),
};

// Wishlist API
export const wishlistAPI = {
  get: () =>
    api.get('/wishlist/'),
  
  addItem: (productId: string) =>
    api.post('/wishlist/items/', { product_id: productId }),
  
  removeItem: (id: string) =>
    api.delete(`/wishlist/items/${id}/`),
};

// Reviews API
export const reviewsAPI = {
  getAll: (params?: any) =>
    api.get('/reviews/', { params }),
  
  create: (data: any) =>
    api.post('/reviews/', data),
  
  update: (id: string, data: any) =>
    api.patch(`/reviews/${id}/`, data),
  
  delete: (id: string) =>
    api.delete(`/reviews/${id}/`),
};

// Vendor API
export const vendorAPI = {
  getDashboard: () =>
    api.get('/vendor/dashboard/'),
  
  getProducts: (params?: any) =>
    api.get('/vendor/products/', { params }),
  
  getOrders: (params?: any) =>
    api.get('/vendor/orders/', { params }),
  
  getEarnings: (params?: any) =>
    api.get('/vendor/earnings/', { params }),
  
  updateOrderStatus: (orderId: string, status: string) =>
    api.patch(`/vendor/orders/${orderId}/status/`, { status }),
  
  getAnalytics: (params?: any) =>
    api.get('/vendor/analytics/', { params }),
  
  getNotifications: () =>
    api.get('/vendor/notifications/'),
  
  markNotificationAsRead: (id: string) =>
    api.patch(`/vendor/notifications/${id}/read/`),
  
  getMessages: () =>
    api.get('/vendor/messages/'),
  
  sendMessage: (data: any) =>
    api.post('/vendor/messages/', data),
};

// Administrator API
export const adminAPI = {
  getDashboard: () =>
    api.get('/admin/dashboard/'),
  
  getMetrics: () =>
    api.get('/admin/metrics/'),
  
  getUsers: (params?: any) =>
    api.get('/admin/users/', { params }),
  
  updateUser: (id: string, data: any) =>
    api.patch(`/admin/users/${id}/`, data),
  
  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}/`),
  
  getVendors: (params?: any) =>
    api.get('/admin/vendors/', { params }),
  
  approveVendor: (id: string) =>
    api.post(`/admin/vendors/${id}/approve/`),
  
  rejectVendor: (id: string, reason: string) =>
    api.post(`/admin/vendors/${id}/reject/`, { reason }),
  
  getProducts: (params?: any) =>
    api.get('/admin/products/', { params }),
  
  approveProduct: (id: string) =>
    api.post(`/admin/products/${id}/approve/`),
  
  rejectProduct: (id: string, reason: string) =>
    api.post(`/admin/products/${id}/reject/`, { reason }),
  
  getCategories: () =>
    api.get('/admin/categories/'),
  
  updateCategory: (id: string, data: FormData) =>
    api.patch(`/admin/categories/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  deleteCategory: (id: string) =>
    api.delete(`/admin/categories/${id}/`),
  
  getTransactions: (params?: any) =>
    api.get('/admin/transactions/', { params }),
  
  approveTransaction: (id: string) =>
    api.post(`/admin/transactions/${id}/approve/`),
  
  rejectTransaction: (id: string, reason: string) =>
    api.post(`/admin/transactions/${id}/reject/`, { reason }),
  
  getNotifications: () =>
    api.get('/admin/notifications/'),
  
  markNotificationAsRead: (id: string) =>
    api.patch(`/admin/notifications/${id}/read/`),
  
  getMessages: () =>
    api.get('/admin/messages/'),
  
  sendMessage: (data: any) =>
    api.post('/admin/messages/', data),
  
  getSystemSettings: () =>
    api.get('/admin/settings/'),
  
  updateSystemSettings: (data: any) =>
    api.patch('/admin/settings/', data),
  
  getAuditLogs: (params?: any) =>
    api.get('/admin/audit-logs/', { params }),
  
  updateUserStatus: async (userId: string, isActive: boolean) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  getAll: () =>
    api.get('/messages/'),
  
  getById: (id: string) =>
    api.get(`/messages/${id}/`),
  
  create: (data: any) =>
    api.post('/messages/', data),
  
  markAsRead: (id: string) =>
    api.patch(`/messages/${id}/read/`),
  
  delete: (id: string) =>
    api.delete(`/messages/${id}/`),
};

// Notifications API
export const notificationsAPI = {
  getAll: () =>
    api.get('/notifications/'),
  
  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read/`),
  
  markAllAsRead: () =>
    api.post('/notifications/mark-all-read/'),
  
  delete: (id: string) =>
    api.delete(`/notifications/${id}/`),
  
  getSettings: () =>
    api.get('/notifications/settings/'),
  
  updateSettings: (data: any) =>
    api.patch('/notifications/settings/', data),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials/'),
  
  create: (data: any) => api.post('/testimonials/', data),
  
  update: (id: string, data: any) => api.patch(`/testimonials/${id}/`, data),
  
  delete: (id: string) => api.delete(`/testimonials/${id}/`),
};

// About API
export const aboutAPI = {
  getAll: () => api.get('/api/about/'),
  getById: (id: string) => api.get(`/api/about/${id}/`),
  create: (data: any) => api.post('/api/about/', data),
  update: (id: string, data: any) => api.put(`/api/about/${id}/`, data),
  delete: (id: string) => api.delete(`/api/about/${id}/`),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/api/profile/'),
  updateProfile: (data: any) => api.put('/api/profile/', data),
  updateProfileImage: (formData: FormData) => api.put('/api/profile/image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  updatePassword: (data: any) => api.put('/api/profile/password/', data),
  updateNotificationSettings: (data: any) => api.put('/api/profile/notifications/', data)
};

export default api;
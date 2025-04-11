import axios, { AxiosInstance, AxiosError } from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

// Function to get CSRF token from cookies
const getCsrfToken = () => {
  const tokenRow = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  if (tokenRow) {
    return tokenRow.split('=')[1];
  }
  return '';
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Extend AxiosInstance to include custom methods
interface CustomAxiosInstance extends AxiosInstance {
  createCategory: (data: FormData) => Promise<any>;
  getCategories: () => Promise<any>;
  // Add other custom methods if needed
}

// Create the axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies automatically
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}) as CustomAxiosInstance;

// Add request interceptor for CSRF and auth tokens
api.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken && !config.headers['X-CSRFToken']) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we have a refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await api.post('/api/token/refresh/', { refresh: refreshToken });
        const { access } = refreshResponse.data;
        
        localStorage.setItem('access_token', access);
        
        // Retry the original request with new access token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        store.dispatch(logout());
        window.location.href = '/login';
        throw refreshError;
      }
    }
    
    return Promise.reject(error);
  }
);

// Implement the createCategory method
api.createCategory = async (data: FormData) => {
  return await api.post('/api/categories/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).catch(error => {
    console.error('Error adding category:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error for further handling
  });
};

api.getCategories = async () => {
  return await api.get('/api/categories/').catch(error => {
    console.error('Error fetching categories:', error.response ? error.response.data : error.message);
    throw error;
  });
};

// Define the AuthResponse type
interface AuthResponse {
  user: any;
  access_token: string;
  refresh_token: string;
}

// Auth API
export type RegisterData = {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  user_type: 'buyer' | 'vendor';
  store_name?: string;
  store_description?: string;
  phone?: string;
  address?: string;
  username?: string;  // Optional since it will be generated from email
};

export const authAPI = {
  register: (data: RegisterData) => {
    // Get CSRF token before making the request
    const csrfToken = getCsrfToken();
    
    // If we don't have a CSRF token, first make a GET request to get one
    if (!csrfToken) {
      return api.get('/api/auth/registration/')
        .then(() => {
          const newCsrfToken = getCsrfToken();
          return api.post('/api/auth/registration/', {
            ...data,
            username: data.email  // Set username to email since backend will generate it
          }, {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': newCsrfToken || '',
            },
          });
        });
    }
    
    // If we already have a CSRF token, use it directly
    return api.post('/api/auth/registration/', {
      ...data,
      username: data.email  // Set username to email since backend will generate it
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
      },
    });
  },
  login: (data: { email: string; password: string }) => {
    // Get CSRF token before making the request
    const csrfToken = getCsrfToken();
    
    // If we don't have a CSRF token, first make a GET request to get one
    if (!csrfToken) {
      return api.get('/api/auth/login/')
        .then(() => {
          const newCsrfToken = getCsrfToken();
          return api.post<AuthResponse>('/api/auth/login/', data, {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': newCsrfToken || '',
            },
          });
        });
    }
    
    // If we already have a CSRF token, use it directly
    return api.post<AuthResponse>('/api/auth/login/', data, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || '',
      },
    });
  },
  refreshToken: () => 
    api.post('/api/token/refresh/', { refresh: localStorage.getItem('refresh_token') }),
  getCurrentUser: () => api.get('/api/auth/user/'),
  updateProfile: (data: any) => api.patch('/api/auth/user/', data),
  updateProfileImage: (formData: FormData) => 
    api.patch('/api/auth/user/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    }),
  updatePassword: (data: { current_password: string; new_password: string }) =>
    api.post('/api/auth/user/change_password/', data),
  updateNotificationSettings: (data: any) => 
    api.patch('/api/auth/user/notification_settings/', data),
  createCategory: (data: FormData) => {
    const csrfToken = getCsrfToken(); // Retrieve CSRF token
    return axios.post(`${API_URL}/api/categories/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Include the Authorization header
      },
    }).catch(error => {
      console.error('Error adding category:', error.response ? error.response.data : error.message);
      throw error; // Rethrow the error for further handling
    });
  },
};

// Products API
export const productsAPI = {
  getAll: (params?: any) =>
    api.get('/api/products/', { params }),
  
  getById: (slug: string) =>
    api.get(`/api/products/${slug}/`),
  
  getFeatured: () =>
    api.get('/api/products/featured/'),
  
  create: (data: FormData) =>
    api.post('/api/products/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  update: (id: string, data: FormData) =>
    api.patch(`/api/products/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  delete: (id: string) =>
    api.delete(`/api/products/${id}/`),
  
  requestApproval: (id: string) =>
    api.post(`/api/products/${id}/request_approval/`),
};

// Categories API
export const categoriesAPI = {
  getAll: () =>
    api.get('/api/categories/'),
  
  getBySlug: (slug: string) =>
    api.get(`/api/categories/${slug}/`),
  
  create: (data: FormData) =>
    api.post('/api/categories/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  update: (id: string, data: FormData) =>
    api.patch(`/api/categories/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  delete: (id: string) =>
    api.delete(`/api/categories/${id}/`),
};

// Cart API
export const cartAPI = {
  get: () =>
    api.get('/api/cart/'),
  
  addItem: (productId: string, quantity: number = 1) =>
    api.post('/api/cart/items/', { product_id: productId, quantity }),
  
  updateItem: (id: string, data: any) =>
    api.patch(`/api/cart/items/${id}/`, data),
  
  removeItem: (id: string) =>
    api.delete(`/api/cart/items/${id}/`),
  
  clear: () =>
    api.delete('/api/cart/'),
};

// Orders API
export const ordersAPI = {
  getAll: () =>
    api.get('/api/orders/'),
  
  getById: (id: string) =>
    api.get(`/api/orders/${id}/`),
  
  create: (data: any) =>
    api.post('/api/orders/', data),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/api/orders/${id}/status/`, { status }),
};

// Wishlist API
export const wishlistAPI = {
  get: () =>
    api.get('/api/wishlist/'),
  
  addItem: (productId: string) =>
    api.post('/api/wishlist/items/', { product_id: productId }),
  
  removeItem: (id: string) =>
    api.delete(`/api/wishlist/items/${id}/`),
};

// Reviews API
export const reviewsAPI = {
  getAll: (params?: any) =>
    api.get('/api/reviews/', { params }),
  
  create: (data: any) =>
    api.post('/api/reviews/', data),
  
  update: (id: string, data: any) =>
    api.patch(`/api/reviews/${id}/`, data),
  
  delete: (id: string) =>
    api.delete(`/api/reviews/${id}/`),
};

// Vendor API
export const vendorAPI = {
  getDashboard: () =>
    api.get('/api/vendor/dashboard/'),
  
  getProducts: (params?: any) =>
    api.get('/api/vendor/products/', { params }),
  
  getOrders: (params?: any) =>
    api.get('/api/vendor/orders/', { params }),
  
  getEarnings: (params?: any) =>
    api.get('/api/vendor/earnings/', { params }),
  
  updateOrderStatus: (orderId: string, status: string) =>
    api.patch(`/api/vendor/orders/${orderId}/status/`, { status }),
  
  getAnalytics: (params?: any) =>
    api.get('/api/vendor/analytics/', { params }),
  
  getNotifications: () =>
    api.get('/api/vendor/notifications/'),
  
  markNotificationAsRead: (id: string) =>
    api.patch(`/api/vendor/notifications/${id}/read/`),
  
  getMessages: () =>
    api.get('/api/vendor/messages/'),
  
  sendMessage: (data: any) =>
    api.post('/api/vendor/messages/', data),
};

// Administrator API
export const adminAPI = {
  getDashboard: () =>
    api.get('/api/admin/dashboard/'),
  
  getMetrics: () =>
    api.get('/api/admin/metrics/'),
  
  getUsers: (params?: any) =>
    api.get('/api/admin/users/', { params }),
  
  updateUser: (id: string, data: any) =>
    api.patch(`/api/admin/users/${id}/`, data),
  
  deleteUser: (id: string) =>
    api.delete(`/api/admin/users/${id}/`),
  
  getVendors: (params?: any) =>
    api.get('/api/admin/vendors/', { params }),
  
  approveVendor: (id: string) =>
    api.post(`/api/admin/vendors/${id}/approve/`),
  
  rejectVendor: (id: string, reason: string) =>
    api.post(`/api/admin/vendors/${id}/reject/`, { reason }),
  
  getProducts: (params?: any) =>
    api.get('/api/admin/products/', { params }),
  
  approveProduct: (id: string) =>
    api.post(`/api/admin/products/${id}/approve/`),
  
  rejectProduct: (id: string, reason: string) =>
    api.post(`/api/admin/products/${id}/reject/`, { reason }),
  
  getCategories: () =>
    api.get('/api/admin/categories/'),
  
  updateCategory: (id: string, data: FormData) =>
    api.patch(`/api/admin/categories/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  deleteCategory: (id: string) =>
    api.delete(`/api/admin/categories/${id}/`),
  
  getTransactions: (params?: any) =>
    api.get('/api/admin/transactions/', { params }),
  
  approveTransaction: (id: string) =>
    api.post(`/api/admin/transactions/${id}/approve/`),
  
  rejectTransaction: (id: string, reason: string) =>
    api.post(`/api/admin/transactions/${id}/reject/`, { reason }),
  
  getNotifications: () =>
    api.get('/api/admin/notifications/'),
  
  markNotificationAsRead: (id: string) =>
    api.patch(`/api/admin/notifications/${id}/read/`),
  
  getMessages: () =>
    api.get('/api/admin/messages/'),
  
  sendMessage: (data: any) =>
    api.post('/api/admin/messages/', data),
  
  getSystemSettings: () =>
    api.get('/api/admin/settings/'),
  
  updateSystemSettings: (data: any) =>
    api.patch('/api/admin/settings/', data),
  
  getAuditLogs: (params?: any) =>
    api.get('/api/admin/audit-logs/', { params }),
  
  updateUserStatus: async (userId: string, isActive: boolean) => {
    const response = await api.patch(`/api/admin/users/${userId}/status`, { isActive });
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  getAll: () =>
    api.get('/api/messages/'),
  
  getById: (id: string) =>
    api.get(`/api/messages/${id}/`),
  
  create: (data: any) =>
    api.post('/api/messages/', data),
  
  markAsRead: (id: string) =>
    api.patch(`/api/messages/${id}/read/`),
  
  delete: (id: string) =>
    api.delete(`/api/messages/${id}/`),
};

// Notifications API
export const notificationsAPI = {
  getAll: () =>
    api.get('/api/notifications/'),
  
  markAsRead: (id: string) =>
    api.patch(`/api/notifications/${id}/read/`),
  
  markAllAsRead: () =>
    api.post('/api/notifications/mark-all-read/'),
  
  delete: (id: string) =>
    api.delete(`/api/notifications/${id}/`),
  
  getSettings: () =>
    api.get('/api/notifications/settings/'),
  
  updateSettings: (data: any) =>
    api.patch('/api/notifications/settings/', data),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => api.get('/api/testimonials/'),
  
  create: (data: any) => api.post('/api/testimonials/', data),
  
  update: (id: string, data: any) => api.patch(`/api/testimonials/${id}/`, data),
  
  delete: (id: string) => api.delete(`/api/testimonials/${id}/`),
};

// Profile API
export const profileAPI = {
  get: () =>
    api.get('/api/profile/'),
  
  update: (data: any) =>
    api.patch('/api/profile/', data),
  
  updateImage: (formData: FormData) =>
    api.patch('/api/profile/image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updatePassword: (data: { current_password: string; new_password: string }) =>
    api.post('/api/profile/password/change/', data),
  
  updateNotificationSettings: (data: any) =>
    api.patch('/api/profile/notifications/settings/', data),
};

// About API
export const aboutAPI = {
  getAll: () => api.get('/api/about/'),
  getById: (id: number) => api.get(`/api/about/${id}/`),
  create: (data: any) => api.post('/api/about/', data),
  update: (id: number, data: any) => api.patch(`/api/about/${id}/`, data),
  delete: (id: number) => api.delete(`/api/about/${id}/`),
};

export default api;
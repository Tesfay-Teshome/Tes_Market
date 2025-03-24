import axios, { AxiosInstance } from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';



// Function to get CSRF token from cookies
const getCsrfToken = () => {
  const tokenRow = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return tokenRow ? tokenRow.split('=')[1] : ''; // Return empty string if token is not found
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
      'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
      'X-CSRFToken': (getCsrfToken() || ''),
  },
}) as CustomAxiosInstance;

// Implement the createCategory method
api.createCategory = async (data: FormData) => {
  const csrfToken = getCsrfToken(); // Retrieve CSRF token
  return await api.post('/admin/categories/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-CSRFToken': csrfToken,
    },
  }).catch(error => {
    console.error('Error adding category:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error for further handling
  });
};


api.getCategories = async () => {
  return await api.get('/admin/categories/').catch(error => {
    console.error('Error fetching categories:', error.response ? error.response.data : error.message);
    throw error;
  });
};



// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token || ''}` as string;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors when we have a valid refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      
      // Immediately clear tokens and logout if no refresh token exists
      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: refreshToken
        });

        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Define the AuthResponse type
interface AuthResponse {
  user: any;
  access_token: string;
  refresh_token: string;
}

// Auth API
export type RegisterData = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  user_type: 'buyer' | 'vendor';
  store_name?: string;
  store_description?: string;
};

export const authAPI = {
  register: (data: RegisterData) => 
    axios.post('http://localhost:8000/api/auth/register/', data),
  
  login: (data: { email: string; password: string }) => 
    axios.post<AuthResponse>('http://localhost:8000/api/auth/login/', data),
  
  refreshToken(refreshToken: string) {
    console.log('Refreshing token with payload:', { refresh: refreshToken }); // Log the refresh token
    return api.post('http://localhost:8000/api/auth/token/refresh/', {
      refresh: refreshToken
    });
   },
  getCurrentUser: () =>
    api.get('/auth/user/'),
  
  updateProfile: (data: any) =>
    api.patch('/auth/profile/', data),
  
  updateProfileImage: (formData: FormData) =>
    api.patch('/auth/profile/image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updatePassword: (data: { current_password: string; new_password: string }) =>
    api.post('/auth/password/change/', data),
  
  updateNotificationSettings: (data: any) =>
    api.patch('/auth/notifications/settings/', data),
  
  createCategory: (data: FormData) => {
    const csrfToken = getCsrfToken(); // Retrieve CSRF token
    return axios.post('http://localhost:8000/api/admin/categories/', data, {
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
  
  getPendingProducts: () =>
    api.get('/admin/products/pending/'),
  
  approveProduct: (id: string) =>
    api.post(`/admin/products/${id}/approve/`),
  
  rejectProduct: (id: string, reason: string) =>
    api.post(`/admin/products/${id}/reject/`, { reason }),
  
  getCategories: () =>
    api.get('/admin/categories/'),
  
  createCategory: (data: FormData) =>
    api.post('/admin/categories/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
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
export interface About {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const aboutAPI = {
  getAll: () =>
    api.get<About[]>('/about/'),
};

// Profile API
export interface Profile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
}

export const profileAPI = {
  get: () =>
    api.get<Profile>('/profile/'),

  update: (data: Partial<Profile>) =>
    api.patch<Profile>('/profile/', data),
};

export default api;
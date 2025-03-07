// src/services/api.ts

import axios from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, logout the user
        store.dispatch(logout());
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) =>
    api.post('/auth/register/', userData),
  
  // Change this line
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login/', credentials),
  
  getCurrentUser: () =>
    api.get('/auth/user/'),
  
  updateProfile: (data: any) =>
    api.patch('/auth/user/', data),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) =>
    api.get('/products/', { params }),
  
  getById: (slug: string) =>
    api.get(`/products/${slug}/`),
  
  getFeatured: () =>
    api.get('/products/featured/'),
  
  create: (data: any) =>
    api.post('/products/', data),
  
  update: (id: string, data: any) =>
    api.patch(`/products/${id}/`, data),
  
  delete: (id: string) =>
    api.delete(`/products/${id}/`),
};

// Categories API
export const categoriesAPI = {
  getAll: () =>
    api.get('/categories/'),
  
  getBySlug: (slug: string) =>
    api.get(`/categories/${slug}/`),
  
  create: (data: any) =>
    api.post('/categories/', data),
  
  update: (slug: string, data: any) =>
    api.patch(`/categories/${slug}/`, data),
  
  delete: (slug: string) =>
    api.delete(`/categories/${slug}/`),
};

// Cart API
export const cartAPI = {
  get: () =>
    api.get('/cart/'),
  
  addItem: (productId: string, quantity: number = 1, variantId?: string) => {
    const data: any = { product: productId, quantity };
    if (variantId) {
      data.variant = variantId;
    }
    return api.post('/cart/add_item/', data);
  },
  
  updateItem: (id: string, data: any) =>
    api.patch(`/cart/items/${id}/`, data),
  
  removeItem: (id: string) =>
    api.delete(`/cart/items/${id}/`),
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
    api.patch(`/orders/${id}/update_status/`, { status }),
};

// Wishlist API
export const wishlistAPI = {
  get: () =>
    api.get('/wishlist/'),
  
  addItem: (productId: string) =>
    api.post('/wishlist/add_item/', { product: productId }),
  
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
  
  getProducts: () =>
    api.get('/vendor/products/'),
  
  getOrders: () =>
    api.get('/vendor/orders/'),
  
  getEarnings: () =>
    api.get('/vendor/earnings/'),
  
  updateOrderStatus: (orderId: string, status: string) =>
    api.patch(`/vendor/orders/${orderId}/`, { status }),
  
  getAnalytics: () =>
    api.get('/vendor/analytics/'),
};

// Administrator API
export const adminAPI = {
  getDashboard: () =>
    api.get('/administrator/dashboard/'),
  
  getMetrics: () =>
    api.get('/administrator/dashboard/metrics/'),
  
  getPendingVendors: () =>
    api.get('/administrator/dashboard/pending_vendors/'),
  
  approveVendor: (id: string) =>
    api.post(`/administrator/dashboard/approve_vendor/${id}/`),
  
  rejectVendor: (id: string) =>
    api.post(`/administrator/dashboard/reject_vendor/${id}/`),
  
  getPendingProducts: () =>
    api.get('/administrator/dashboard/pending_products/'),
  
  approveProduct: (id: string) =>
    api.post(`/administrator/dashboard/approve_product/${id}/`),
  
  rejectProduct: (id: string, note: string) =>
    api.post(`/administrator/dashboard/reject_product/${id}/`, { note }),
  
  getUsers: (search?: string) =>
    api.get('/admin/users/', { params: { search } }),
  
  updateUserStatus: (userId: string, isActive: boolean) =>
    api.patch(`/admin/users/${userId}/`, { is_active: isActive }),
  
  getCategories: () =>
    api.get('/admin/categories/'),
  
  createCategory: (data: any) =>
    api.post('/admin/categories/', data),
  
  updateCategory: (id: string, data: any) =>
    api.patch(`/admin/categories/${id}/`, data),
  
  deleteCategory: (id: string) =>
    api.delete(`/admin/categories/${id}/`),
  
  getTransactions: (search?: string) =>
    api.get('/admin/transactions/', { params: { search } }),
  
  approveTransaction: (id: string) =>
    api.patch(`/admin/transactions/${id}/approve/`),
  
  rejectTransaction: (id: string) =>
    api.patch(`/admin/transactions/${id}/reject/`),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () =>
    api.get('/testimonials/'),
  
  create: (data: any) =>
    api.post('/testimonials/', data),
  
  update: (id: string, data: any) =>
    api.patch(`/testimonials/${id}/`, data),
  
  delete: (id: string) =>
    api.delete(`/testimonials/${id}/`),
};

// Buyer API
export const buyerAPI = {
  getOrders: () =>
    api.get('/buyer/orders/'),
  
  getWishlist: () =>
    api.get('/buyer/wishlist/'),
  
  getCart: () =>
    api.get('/buyer/cart/'),
};

export default api;
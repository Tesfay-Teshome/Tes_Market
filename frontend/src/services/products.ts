import { api } from '../config/api';
import { Product } from '../types';

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: File[];
}

export const productService = {
  getProducts: async (params?: { category?: string; search?: string }) => {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  createProduct: async (data: CreateProductData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') {
        (value as File[]).forEach((file) => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post('/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<CreateProductData>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && value) {
        (value as File[]).forEach((file) => {
          formData.append('images', file);
        });
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.patch(`/products/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
import { api } from '../config/api';
import { Transaction } from '../types';

export const transactionService = {
  getTransactions: async (role: 'buyer' | 'vendor') => {
    const response = await api.get(`/transactions/${role}/`);
    return response.data;
  },

  createTransaction: async (productId: string, quantity: number) => {
    const response = await api.post('/transactions/', { productId, quantity });
    return response.data;
  },

  approveTransaction: async (transactionId: string) => {
    const response = await api.post(`/transactions/${transactionId}/approve/`);
    return response.data;
  },
};
import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'buyer' | 'vendor') => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = await authService.login({ email, password });
      localStorage.setItem('token', token);
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: 'Invalid credentials', isLoading: false });
    }
  },

  register: async (name, email, password, role) => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = await authService.register({ name, email, password, role });
      localStorage.setItem('token', token);
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: 'Registration failed', isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      set({ user: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.getProfile();
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load user', isLoading: false });
      localStorage.removeItem('token');
    }
  },
}));
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import api from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: async (credentials) => {
        try {
          const response = await api.post('/auth/login/', credentials);
          const { user, token } = response.data;
          set({ user, token, isAuthenticated: true });
          localStorage.setItem('token', token);
        } catch (error) {
          throw error;
        }
      },
      register: async (data) => {
        try {
          const response = await api.post('/api/auth/registration/', data);
          const { user, token } = response.data;
          set({ user, token, isAuthenticated: true });
          localStorage.setItem('token', token);
        } catch (error) {
          throw error;
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
      },
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export { useAuth };
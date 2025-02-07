import { createContext, useContext } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  user_type: 'buyer' | 'vendor' | 'administrator';
  full_name: string;
  is_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const response = await axios.post('/auth/login/', {
      email,
      password,
    });

    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      return response.data.user;
    }
    throw new Error('Login failed: No access token received');
  } catch (err: any) {
    if (err.response?.data?.detail) {
      throw new Error(err.response.data.detail);
    }
    throw new Error('Invalid email or password');
  }
}

export function logout() {
  localStorage.removeItem('authToken');
  window.location.href = '/auth/login';
}

export default AuthContext;

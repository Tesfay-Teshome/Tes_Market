import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'vendor' | 'admin';
  profileImage?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: 'buyer' | 'vendor';
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('/auth/user/');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Log the request payload
      console.log("Login request payload:", { username: email, password });
  
      const response = await axios.post('/token/', {
        username: email, // Use 'username' if required by your API
        password: password,
      });
  
      const { access, refresh, user } = response.data; // Assuming the response structure is correct
  
      localStorage.setItem('authToken', access);
      localStorage.setItem('refreshToken', refresh);
      setUser(user); 
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'buyer' | 'vendor';
  }) => {
    try {
      const response = await axios.post('/auth/registration/', userData);  // Corrected: Removed /api
      const { access, user } = response.data;
      localStorage.setItem('authToken', access);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };
  
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

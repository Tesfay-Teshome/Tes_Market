import { useState, useEffect, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/login/', {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      if (token) {
        localStorage.setItem('authToken', token);
        setUser(userData);
        navigate(userData.role === 'vendor' ? '/vendor/dashboard' : '/buyer/dashboard');
      } else {
        throw new Error('No authentication token received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        throw new Error(error.response.data.non_field_errors[0]);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/auth/login');
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setUser(null);
        return;
      }

      const response = await axios.get('/auth/user/');
      setUser(response.data);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth }
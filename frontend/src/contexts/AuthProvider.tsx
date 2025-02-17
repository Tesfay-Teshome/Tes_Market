import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

interface User {
    createdAt: string | number | Date;
    id: number;
    email: string;
    full_name: string;
    user_type: string;
    is_verified: boolean;
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
    full_name: string;
    user_type: 'buyer' | 'vendor';
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

            const response = await axios.get('/users/me/');  // Corrected API Endpoint
            setUser(response.data);
        } catch (error: any) {
            console.error("Error checking auth:", error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('/auth/login/', {
                email: email,
                password: password,
            });

            const { access, refresh } = response.data;

            localStorage.setItem('authToken', access);
            localStorage.setItem('refreshToken', refresh);

            await checkAuth(); // Fetch user data after login
            navigate("/");
        } catch (error: any) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        navigate('/auth/login');
    };

    const register = async (userData: {
      email: string;
      password: string;
      full_name: string;
      user_type: 'buyer' | 'vendor';
  }) => {
      try {
          await axios.post('/auth/register/', userData);
          await login(userData.email, userData.password);
      } catch (error: any) {
          console.error("Registration error:", error);
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

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
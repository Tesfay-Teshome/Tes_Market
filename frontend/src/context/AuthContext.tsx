import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import AuthContext from '../hooks/useAuth';

interface User {
  id: number;
  email: string;
  user_type: 'buyer' | 'vendor' | 'administrator';
  full_name: string;
  is_verified?: boolean;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await axios.get('/api/auth/user/');
        setUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/auth/login/', {
        email,
        password,
      });

      const { access_token, user: userData } = response.data;

      if (access_token) {
        localStorage.setItem('authToken', access_token);
        setUser(userData);
        
        // Redirect based on user type
        if (userData.user_type === 'vendor') {
          if (!userData.is_verified) {
            navigate('/vendor/pending-verification');
          } else {
            navigate('/vendor/dashboard');
          }
        } else {
          navigate('/');
        }
      } else {
        throw new Error('Login failed: No access token received');
      }
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.response?.data?.non_field_errors) {
        throw new Error(error.response.data.non_field_errors[0]);
      } else {
        throw new Error('Invalid email or password');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/auth/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

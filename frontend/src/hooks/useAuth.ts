import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setUser, logout, login } from '@/store/slices/authSlice';
import { authAPI } from '@/services/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const [localLoading, setLocalLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access, refresh, user } = response.data;
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Update user state
      dispatch(setUser(user));
      return { success: true, user };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refreshToken(refreshToken);
      const { access, refresh } = response.data;
      
      // Update tokens in localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Update user state from new token
      const decoded = jwtDecode(access);
      dispatch(setUser({
        username: decoded.username,
        user_type: decoded.user_type,
        profile_image: decoded.profile_image
      }));
      
      return { success: true, access, refresh };
    } catch (error: any) {
      localStorage.clear();
      return { success: false, error: error.response?.data?.detail || 'Token refresh failed' };
    }
  };

  const logout = () => {
    dispatch(logout());
    localStorage.clear();
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await authAPI.updateProfile(data);
      dispatch(setUser(response.data));
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return { success: false, error: error.response?.data?.detail || 'Profile update failed' };
    }
  };

  const updateProfileImage = async (formData: FormData) => {
    try {
      const response = await authAPI.updateProfileImage(formData);
      dispatch(setUser(response.data));
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Update profile image error:', error);
      return { success: false, error: error.response?.data?.detail || 'Profile image update failed' };
    }
  };

  const updatePassword = async (data: { current_password: string; new_password: string }) => {
    try {
      const response = await authAPI.updatePassword(data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Update password error:', error);
      return { success: false, error: error.response?.data?.detail || 'Password update failed' };
    }
  };

  const updateNotificationSettings = async (data: any) => {
    try {
      const response = await authAPI.updateNotificationSettings(data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Update notification settings error:', error);
      return { success: false, error: error.response?.data?.detail || 'Notification settings update failed' };
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          dispatch(setUser({
            username: decoded.username,
            user_type: decoded.user_type,
            profile_image: decoded.profile_image
          }));
        } catch (error) {
          localStorage.clear();
        }
      }
      setLocalLoading(false);
    };

    initializeAuth();
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading: loading || localLoading,
    error,
    login,
    register,
    refreshToken,
    logout,
    updateProfile,
    updateProfileImage,
    updatePassword,
    updateNotificationSettings,
  };
};

export default useAuth;
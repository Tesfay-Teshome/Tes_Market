import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authAPI } from '@/services/api';
import { setUser, setLoading } from '@/store/slices/authSlice';

const useCheckAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const response = await authAPI.getCurrentUser();
        dispatch(setUser(response.data));
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);
};

export default useCheckAuth;
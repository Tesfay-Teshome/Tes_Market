import { useEffect } from 'react';
import useAuth from './useAuth';
import { store } from '@/store';
import { setUser, setTokens } from '@/store/slices/authSlice';

const useCheckAuth = () => {
  const { isAuthenticated, user, refreshToken: refreshFn } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const accessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');

        if (accessToken && storedRefreshToken) {
          try {
            const result = await refreshFn();
            if (result.success) {
              const { access, refresh } = result;
              localStorage.setItem('access_token', access);
              localStorage.setItem('refresh_token', refresh);
              store.dispatch(setTokens({ access, refresh }));
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            // Clear all auth data if refresh fails
            localStorage.clear();
            store.dispatch(setUser(null));
          }
        } else {
          // No tokens found, clear auth state
          localStorage.clear();
          store.dispatch(setUser(null));
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, user, refreshFn]);
};

export default useCheckAuth;
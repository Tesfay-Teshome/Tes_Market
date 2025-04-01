import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import useCheckAuth from '@/hooks/useCheckAuth';
import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';
import { setUser } from './store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { authAPI } from '@/services/api';
import { User } from '@/types';
import { RouterProvider } from 'react-router-dom';
import router from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useCheckAuth();
  useSocket();
  return <>{children}</>;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const user: User = await authAPI.getCurrentUser();
          dispatch(setUser(user));
        } catch (error) {
          localStorage.clear();
        }
      }
    };
    initializeAuth();
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

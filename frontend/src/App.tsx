import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from '@/routes';
import { Toaster } from '@/components/ui/toaster';
import useCheckAuth from '@/hooks/useCheckAuth';
import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';
import { setUser } from './store/slices/authSlice';
import { authAPI } from '@/services/api';
import { useDispatch } from 'react-redux';

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
  useSocket(); // Add socket connection
  return <>{children}</>;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          dispatch(setUser({
            username: decoded.username,
            email: decoded.email,
            user_type: decoded.user_type,
            profile_image: decoded.profile_image
          }));
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.clear();
          dispatch(setUser(null));
        }
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
};

export default App;

const jwtDecode = (token: string) => {
  const tokenParts = token.split('.');
  return JSON.parse(atob(tokenParts[1]));
};

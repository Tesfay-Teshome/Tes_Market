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
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          // Fetch complete user data from API
          const response = await authAPI.getCurrentUser();
          const userData = response.data;
          
          dispatch(setUser({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            user_type: decoded.user_type,
            phone: userData.phone,
            address: userData.address,
            profile_image: userData.profile_image,
            store_name: userData.store_name,
            store_description: userData.store_description,
            is_verified: userData.is_verified,
            created_at: userData.created_at,
            updated_at: userData.updated_at
          }));
        } catch (error) {
          console.error('Error initializing auth:', error);
          dispatch(setUser(null));
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;

// Helper function for JWT decoding
const jwtDecode = (accessToken: string) => {
  const tokenParts = accessToken.split('.');
  return JSON.parse(atob(tokenParts[1]));
};

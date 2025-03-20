import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from '@/store';
import AppRoutes from '@/routes';
import { Toaster } from '@/components/ui/toaster';
import useCheckAuth from '@/hooks/useCheckAuth';
import { useSocket } from '@/hooks/useSocket';

const queryClient = new QueryClient();

function AuthProvider({ children }: { children: React.ReactNode }) {
  useCheckAuth();
  useSocket(); // Add socket connection
  return <>{children}</>;
}

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </Provider>
);

export default App;
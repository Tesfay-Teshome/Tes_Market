import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm, RegisterForm } from '../components/AuthForms';
import { useAuth } from '../hooks/useAuth';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { } = useAuth();

  // Get the return URL from location state, or default to '/'
  const from = (location.state as { from?: string })?.from || '/';

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <RegisterForm onSuccess={() => {
              // After registration, switch to login form
              setIsLogin(true);
            }} />
          )}
        </div>
      </div>

      {/* Password Reset Link */}
      {isLogin && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot your password?
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google/';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/api/auth/facebook/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md px-6 animate-fade-in">
        <div className="auth-container bg-white/90">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gradient mb-3 text-shadow-lg">Welcome Back</h2>
            <p className="text-lg text-gray-600 font-medium">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg animate-fade-in">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-delay">
            <div className="space-y-2">
              <label htmlFor="email" className="auth-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between text-sm mt-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-700 font-medium">
                  Remember me
                </label>
              </div>
              <Link
                to="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-button mt-8"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 py-1 bg-white text-gray-500 font-medium rounded-full border border-gray-200">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="social-auth-button"
              >
                <FcGoogle className="text-xl mr-2" />
                Google
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                className="social-auth-button"
              >
                <FaFacebook className="text-xl mr-2 text-blue-600" />
                Facebook
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

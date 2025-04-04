import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Mail, Lock, ArrowRight, Facebook, Shield, Truck } from 'lucide-react';
import { authAPI } from '@/services/api';
import { setUser, setTokens } from '@/store/slices/authSlice';
import { useToast } from '@/components/ui/use-toast';
import FadeIn from '@/components/animations/FadeIn';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const from = location.state?.from?.pathname || '/';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      const response = await authAPI.login({
        email: data.email,
        password: data.password
      });

      // Get the user data from the response
      const { access, refresh, user } = response;

      // Save tokens to localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Update Redux store with login data
      dispatch(setUser(user));
      dispatch(setTokens({ access, refresh }));

      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });

      // Reset form after successful login
      reset();

      // Redirect based on user type or back to the page they came from
      if (from !== '/') {
        navigate(from);
      } else {
        switch (user.user_type) {
          case 'administrator':
            navigate('/administrator');
            break;
          case 'vendor':
            navigate('/vendor');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error: any) {
      
      // Handle different types of errors
      if (error.response?.data) {
        toast({
          title: 'Login failed',
          description: error.response.data.detail || 'Invalid email or password.',
          variant: 'destructive',
        });
      } else if (error.message) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login failed',
          description: 'An unexpected error occurred. Please try again later.',
          variant: 'destructive',
        });
      }
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full flex rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8 lg:p-12">
          <FadeIn>
            <div className="text-center mb-8">
              <Link to="/" className="flex items-center justify-center text-blue-600 mb-6">
                <ShoppingBag className="h-12 w-12" />
              </Link>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to your account to continue
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Email"
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      {...register('password')}
                      type="password"
                      placeholder="Password"
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-1"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Create one now
                  </Link>
                </p>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      className="h-5 w-5"
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                    />
                    <span>Google</span>
                  </button>
                  <button 
                    type="button"
                    className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Facebook className="h-5 w-5 text-[#1877F2]" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </form>
          </FadeIn>
        </div>

        {/* Right side - Image/Illustration */}
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12">
          <div className="h-full flex flex-col justify-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Welcome to Tes Market</h2>
              <p className="text-xl mb-8">Your trusted marketplace for quality products from verified vendors worldwide.</p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg">Wide range of products</span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg">Secure transactions</span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg">Fast delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
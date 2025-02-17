import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../../utils/axios';  // Use our configured axios instance
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Upload, X, ShoppingBag, Store } from 'lucide-react';
import { useAuth } from '../../contexts/AuthProvider';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  address?: string;
  userType: 'buyer' | 'seller';
  storeName?: string;
  storeDescription?: string;
  termsAccepted: boolean;
  profileImage?: FileList;
}

const Register: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm<RegisterFormData>({
    defaultValues: {
      userType: 'buyer'
    }
  });
  const { login } = useAuth(); // Get login function from AuthProvider
  const password = watch('password');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue('profileImage', event.target.files as FileList);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue('profileImage', undefined);
  };

  const getDashboardPath = (userType: string) => {
    switch (userType) {
      case 'seller':
        return '/vendor/dashboard';
      case 'buyer':
        return '/buyer/dashboard';
      default:
        return '/';
    }
  };

 const onSubmit = async (data: RegisterFormData) => {
        try {
            setError('');

            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('confirm_password', data.confirmPassword);
            formData.append('full_name', data.fullName);
            formData.append('user_type', data.userType === 'seller' ? 'vendor' : 'buyer');
            if (data.phoneNumber) formData.append('phone_number', data.phoneNumber);
            if (data.address) formData.append('address', data.address);

            if (data.userType === 'seller') {
                if (!data.storeName) {
                    setError('Store name is required for vendors');
                    return;
                }
                formData.append('store_name', data.storeName);
                if (data.storeDescription) {
                    formData.append('store_description', data.storeDescription);
                }
            }

            if (data.profileImage?.[0]) {
                formData.append('profile_image', data.profileImage[0]);
            }

            // Attempt registration
            await axios.post('/auth/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Registration successful, log in the user
            await login(data.email, data.password);
            toast.success('Registration successful! Redirecting...');
            reset(); // Reset the form
            navigate(getDashboardPath(data.userType));

        } catch (err: any) {
            console.error('Registration error:', err);
            if (err.response?.data?.username) {
                // Handle "This email is already registered." error from backend
                setError(err.response.data.username[0]);
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else if (err.response?.data?.email) {
                setError(err.response.data.email[0]);
            } else if (err.response?.data?.password) {
                setError(err.response.data.password[0]);
            } else if (err.response?.data?.non_field_errors) {
                setError(err.response.data.non_field_errors[0]);
            } else {
                setError(err.message || 'An error occurred during registration');
            }
        }
    };


  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google/register/';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/api/auth/facebook/register/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md px-6 animate-fade-in">
        <div className="auth-container bg-white/90">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gradient mb-3 text-shadow-lg">Create Account</h2>
            <p className="text-lg text-gray-600 font-medium">Join our community today</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg animate-fade-in">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-delay">
            {/* Profile Image Upload */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-200 shadow-lg">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-500">Upload Photo</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <label className={`
                flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg
                ${watch('userType') === 'buyer'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'}
              `}>
                <input
                  type="radio"
                  value="buyer"
                  {...register('userType')}
                  className="sr-only"
                />
                <ShoppingBag className={`h-8 w-8 mb-2 ${watch('userType') === 'buyer' ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`font-semibold ${watch('userType') === 'buyer' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Buyer
                </span>
              </label>

              <label className={`
                flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg
                ${watch('userType') === 'seller'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'}
              `}>
                <input
                  type="radio"
                  value="seller"
                  {...register('userType')}
                  className="sr-only"
                />
                <Store className={`h-8 w-8 mb-2 ${watch('userType') === 'seller' ? 'text-blue-500' : 'text-gray-400'}`} />
                <span className={`font-semibold ${watch('userType') === 'seller' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Seller
                </span>
              </label>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="auth-label">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('fullName', { required: 'Full name is required' })}
                  className="auth-input"
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="auth-label">
                  Email address
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="auth-input"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  className="auth-input"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="auth-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    validate: value =>
                      value === password || 'The passwords do not match',
                  })}
                  className="auth-input"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="auth-label">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  className="auth-input"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="auth-label">
                  Address (Optional)
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="auth-input"
                  placeholder="Enter your address"
                />
              </div>

              {watch('userType') === 'seller' && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="storeName" className="auth-label">
                      Store Name
                    </label>
                    <input
                      type="text"
                      {...register('storeName', { required: 'Store name is required for sellers' })}
                      className="auth-input"
                      placeholder="Your Store Name"
                    />
                    {errors.storeName && (
                      <p className="mt-2 text-sm text-red-600 font-medium">{errors.storeName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="storeDescription" className="auth-label">
                      Store Description
                    </label>
                    <textarea
                      {...register('storeDescription')}
                      className="auth-input"
                      placeholder="Describe your store"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                {...register('termsAccepted', {
                  required: 'You must accept the terms and conditions',
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700 font-medium">
                I agree to the{' '}
                <Link to="/auth/terms" className="text-blue-600 hover:text-blue-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/auth/privacy" className="text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.termsAccepted.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-button mt-8"
            >
              Create Account
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
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
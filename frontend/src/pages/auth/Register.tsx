import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../../utils/axios';  // Use our configured axios instance
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Upload, X } from 'lucide-react';
import { ShoppingBag, Store } from 'lucide-react';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  address?: string;
  userType: 'buyer' | 'seller';
  termsAccepted: boolean;
  profileImage?: FileList;
}

const Register: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<RegisterFormData>({
    defaultValues: {
      userType: 'buyer'
    }
  });
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
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('username', data.email);
      formData.append('email', data.email);
      formData.append('password1', data.password);
      formData.append('password2', data.confirmPassword);
      formData.append('full_name', data.fullName);
      if (data.phoneNumber) formData.append('phone_number', data.phoneNumber);
      if (data.address) formData.append('address', data.address);
      formData.append('user_type', data.userType);
      
      // Append profile image if exists
      if (data.profileImage?.[0]) {
        formData.append('profile_image', data.profileImage[0]);
      }

      const response = await axios.post('/api/auth/registration/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const token = response.data.access || 
                   response.data.token || 
                   response.data.key ||
                   (response.data.tokens && (response.data.tokens.access || response.data.tokens.token));

      if (token) {
        localStorage.setItem('authToken', token);
        try {
          const tokenResponse = await axios.post('/api/token/', {
            username: data.email,
            password: data.password
          });
          
          if (tokenResponse.data.access) {
            localStorage.setItem('authToken', tokenResponse.data.access);
            
            // Update user profile if needed
            if (data.profileImage?.[0]) {
              const profileFormData = new FormData();
              profileFormData.append('profile_image', data.profileImage[0]);
              try {
                await axios.patch('/api/auth/user/', profileFormData, {
                  headers: {
                    'Authorization': `Bearer ${tokenResponse.data.access}`,
                    'Content-Type': 'multipart/form-data',
                  }
                });
              } catch (profileErr) {
                console.error('Error updating profile image:', profileErr);
              }
            }
            
            navigate(getDashboardPath(data.userType));
          }
        } catch (err) {
          console.error('Error in token/profile update:', err);
          setError('An error occurred during registration. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred during registration');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google/register/';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/api/auth/facebook/register/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 animate-gradient-x">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 w-auto animate-float"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 animate-fade-in">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-2xl shadow-blue-100/50 sm:rounded-xl sm:px-10 transform transition-all duration-300 hover:scale-[1.01]">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-200">
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
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-xs text-gray-500">Upload Photo</p>
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
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className={`
                flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
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
                <span className={`font-medium ${watch('userType') === 'buyer' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Buyer
                </span>
              </label>

              <label className={`
                flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
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
                <span className={`font-medium ${watch('userType') === 'seller' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Seller
                </span>
              </label>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  {...register('fullName', { required: 'Full name is required' })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  {...register('confirmPassword', {
                    validate: value =>
                      value === password || 'The passwords do not match',
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  {...register('address')}
                  rows={3}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                  placeholder="Enter your address"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('termsAccepted', {
                  required: 'You must accept the terms and conditions',
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
              />
              <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="mt-2 text-sm text-red-600">{errors.termsAccepted.message}</p>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <FcGoogle className="h-5 w-5" />
                <span className="ml-2">Google</span>
              </button>

              <button
                onClick={handleFacebookLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <FaFacebook className="h-5 w-5 text-blue-600" />
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { LoginCredentials, registerUser, RegisterData } from '../../api/auth';
import { useAuth } from '../../contexts/AuthProvider'; // Adjust path if necessary
import { toast } from 'react-hot-toast';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data);
      toast.success('Registration successful! Redirecting...');
      // Log the user in immediately after registration
      await login(data.email, data.password);
      navigate('/');
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message === 'This email is already registered.') { // Correct message
        setRegistrationError(error.message);
      }
      else {
        setRegistrationError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Register</h2>

        {registrationError && (
          <div className="text-red-500 text-sm italic mb-4">{registrationError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="full_name">
              Full Name
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.full_name ? 'border-red-500' : ''}`}
              id="full_name"
              type="text"
              placeholder="Full Name"
              {...register("full_name", { required: "Full name is required" })}
            />
            {errors.full_name && <p className="text-red-500 text-xs italic">{errors.full_name.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
              id="email"
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
              id="password"
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_type">
              User Type
            </label>
            <select
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.user_type ? 'border-red-500' : ''}`}
              id="user_type"
              {...register("user_type", { required: "User type is required" })}
            >
              <option value="">Select User Type</option>
              <option value="buyer">Buyer</option>
              <option value="vendor">Vendor</option>
            </select>
            {errors.user_type && <p className="text-red-500 text-xs italic">{errors.user_type.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Register
            </button>
            <Link to="/auth/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
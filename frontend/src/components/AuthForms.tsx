import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { loginUser, registerUser } from '../api/auth'
import { toast } from 'react-hot-toast'
import { 
  Mail, 
  Lock, 
  User, 
  UserPlus, 
  LogIn, 
  Github, 
  Facebook, 
  Google,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const response = await loginUser(data)
      onSuccess()
      toast.success('Logged in successfully!')
    } catch (error) {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-colors h-5 w-5" />
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              type="email"
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 group-hover:border-indigo-300 transition-all"
              placeholder="your@email.com"
            />
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{errors.email.message as string}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-colors h-5 w-5" />
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 group-hover:border-indigo-300 transition-all"
              placeholder="••••••••"
            />
            {errors.password && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{errors.password.message as string}</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogIn className="h-5 w-5 mr-2" />
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Google className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Facebook className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Github className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      await registerUser(data)
      onSuccess()
      toast.success('Account created successfully!')
    } catch (error) {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-colors h-5 w-5" />
            <input
              {...register('username', { required: 'Full name is required' })}
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 group-hover:border-indigo-300 transition-all"
              placeholder="John Doe"
            />
            {errors.username && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{errors.username.message as string}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-colors h-5 w-5" />
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              type="email"
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 group-hover:border-indigo-300 transition-all"
              placeholder="your@email.com"
            />
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{errors.email.message as string}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-colors h-5 w-5" />
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              type="password"
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 group-hover:border-indigo-300 transition-all"
              placeholder="••••••••"
            />
            {errors.password && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{errors.password.message as string}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-colors h-5 w-5" />
            <input
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val: string) => {
                  if (watch('password') != val) {
                    return "Passwords do not match";
                  }
                }
              })}
              type="password"
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 group-hover:border-indigo-300 transition-all"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{errors.confirmPassword.message as string}</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Google className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Facebook className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Github className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

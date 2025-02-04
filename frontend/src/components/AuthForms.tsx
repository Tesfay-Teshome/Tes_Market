import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { loginUser, registerUser } from '../api/auth'
import { toast } from 'react-hot-toast'
import { Mail, Lock, User, UserPlus, LogIn } from 'lucide-react'

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit } = useForm()
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            {...register('email')}
            type="email"
            required
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            {...register('password')}
            type="password"
            required
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <LogIn className="h-5 w-5 mr-2" />
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register, handleSubmit } = useForm()
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            {...register('name')}
            required
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            {...register('email')}
            type="email"
            required
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            {...register('password')}
            type="password"
            required
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}

import { useState } from 'react'
import { Link, useNavigate, Routes, Route } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LoginForm, RegisterForm } from '../components/AuthForms'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { login } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>

        <Routes>
          <Route path="login" element={<LoginForm onSuccess={() => navigate('/')} />} />
          <Route path="register" element={<RegisterForm onSuccess={() => navigate('/')} />} />
        </Routes>

        <div className="mt-6 text-center text-sm">
          <Link 
            to="/" 
            className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center"
          >
            <span className="mr-1">←</span>
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
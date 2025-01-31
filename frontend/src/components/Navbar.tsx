import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Store, Heart } from 'lucide-react';
import { useAuth } from '../stores/auth';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">Tes Market</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <ShoppingCart className="h-6 w-6" />
                </Link>

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <Heart className="h-6 w-6" />
                </Link>

                {/* Dashboard Link based on user type */}
                {user?.user_type === 'vendor' && (
                  <Link
                    to="/vendor/dashboard"
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <Store className="h-6 w-6" />
                  </Link>
                )}

                {user?.user_type === 'buyer' && (
                  <Link
                    to="/buyer/dashboard"
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <User className="h-6 w-6" />
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
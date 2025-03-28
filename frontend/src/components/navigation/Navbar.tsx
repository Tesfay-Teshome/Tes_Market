import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  User,
  Store,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ChevronDown,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import { RootState } from '@/store';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(logout());
    setIsUserMenuOpen(false);
    window.location.reload(); // Force full state reset
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <nav className={`transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and Primary Navigation */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ShoppingBag className="h-8 w-8 mr-2" />
                <span className="hidden sm:inline">Tes Market</span>
              </Link>
              
              <div className="hidden md:flex items-center ml-10 space-x-1">
                <Link
                  to="/products"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50"
                >
                  Products
                </Link>
                <Link
                  to="/categories"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50"
                >
                  Categories
                </Link>
                <Link
                  to="/vendors"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50"
                >
                  Vendors
                </Link>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50"
                >
                  Contact
                </Link>
                {user?.user_type === 'vendor' && (
                  <Link
                    to="/vendor/dashboard"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50"
                  >
                    <Store className="h-5 w-5 inline-block mr-1" />
                    Vendor Dashboard
                  </Link>
                )}
              </div>
            </div>

            {/* User Navigation */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    {user && user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.username || user.email}
                        className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-700">
                        {user?.username || user?.email.split('@')[0]}
                      </p>
                      {user?.user_type === 'administrator' && (
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      )}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      >
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Profile
                          </Link>
                          {user?.user_type === 'buyer' && (
                            <>
                              <Link
                                to="/wishlist"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Wishlist
                              </Link>
                              <Link
                                to="/cart"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Cart
                              </Link>
                            </>
                          )}
                          {user?.user_type === 'vendor' && (
                            <Link
                              to="/vendor/dashboard"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Vendor Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
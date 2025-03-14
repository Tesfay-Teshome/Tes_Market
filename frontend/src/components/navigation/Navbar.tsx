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
    dispatch(logout());
    setIsUserMenuOpen(false);
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
              </div>
            </div>

            {/* User Navigation */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="text-gray-600 hover:text-blue-600 transition-colors relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* Administrator Link */}
                  {user?.user_type === 'administrator' && (
                    <Link
                      to="/administrator"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      title="Admin Dashboard"
                    >
                      <LayoutDashboard className="h-6 w-6" />
                    </Link>
                  )}

                  {/* Vendor Link */}
                  {user?.user_type === 'vendor' && (
                    <>
                      <Link
                        to="/vendor"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        title="Vendor Dashboard"
                      >
                        <Store className="h-6 w-6" />
                      </Link>
                      <Link
                        to="/vendor/dashboard"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        title="Vendor Dashboard"
                      >
                        <Store className="h-6 w-6" /> {/* Added icon for vendor dashboard */}
                        Vendor Dashboard
                      </Link>
                    </>
                  )}

                  {/* Buyer Links */}
                  {user?.user_type === 'buyer' && (
                    <>
                      <Link
                        to="/wishlist"
                        className="text-gray-600 hover:text-blue-600 transition-colors relative group"
                        title="Wishlist"
                      >
                        <Heart className="h-6 w-6" />
                        <span className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                          Wishlist
                        </span>
                      </Link>
                      <Link
                        to="/cart"
                        className="text-gray-600 hover:text-blue-600 transition-colors relative group"
                        title="Shopping Cart"
                      >
                        <ShoppingCart className="h-6 w-6" />
                        {items.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {items.length}
                          </span>
                        )}
                      </Link>
                    </>
                  )}

                  {/* User Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      {user && user.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt={user.username}
                          className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={menuVariants}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          </div>
                          
                          <div className="py-1">
                            <Link
                              to="/profile"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Profile Settings
                            </Link>
                            
                            <Link
                              to="/orders"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Package className="h-4 w-4 mr-2" />
                              My Orders
                            </Link>
                            
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/products"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/categories"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  to="/vendors"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Vendors
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
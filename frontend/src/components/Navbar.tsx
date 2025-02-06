import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { 
  ShoppingCart, 
  User, 
  LogIn, 
  UserPlus,
  Package,
  Home,
  Store,
  BarChart,
  LogOut,
  Settings,
  Bell,
  Search,
  ChevronDown,
  FolderOpen,
  Info,
  MessageCircle,
  BookOpen,
  HelpCircle,
  X,
  Menu,
  ShoppingBag
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
      ? 'bg-gradient-to-r from-blue-900 to-purple-900 shadow-lg' 
      : 'bg-gradient-to-r from-blue-800/90 to-purple-800/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:scale-105 transition-transform duration-300"
          >
            <ShoppingBag className="h-8 w-8" />
            <span className="text-xl font-bold">Tes Market</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="nav-link text-gray-100 hover:text-white transition-colors duration-300"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="nav-link text-gray-100 hover:text-white transition-colors duration-300"
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              className="nav-link text-gray-100 hover:text-white transition-colors duration-300"
            >
              Contact
            </Link>
            <Link 
              to="/about" 
              className="nav-link text-gray-100 hover:text-white transition-colors duration-300"
            >
              About
            </Link>
            <Link 
              to="/faq" 
              className="nav-link text-gray-100 hover:text-white transition-colors duration-300"
            >
              FAQ
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/cart" 
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <img 
                      src={user?.profileImage || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border-2 border-blue-500 hover:border-blue-600 transition-colors"
                    />
                    <ChevronDown className="h-4 w-4 text-white group-hover:text-blue-200 transition-colors" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-50"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-50"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Link>
                    {user?.role === 'vendor' && (
                      <Link 
                        to="/vendor/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-50"
                      >
                        <Store className="h-4 w-4 mr-2" />
                        Vendor Dashboard
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-800 hover:bg-blue-50"
                      >
                        <BarChart className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-blue-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/auth/login" 
                  className="text-white hover:text-blue-200 transition-colors flex items-center"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  Login
                </Link>
                <Link 
                  to="/auth/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors flex items-center"
                >
                  <UserPlus className="h-5 w-5 mr-1" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={toggleMenu}
              >
                Products
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link 
                to="/faq" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={toggleMenu}
              >
                FAQ
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-white hover:text-blue-200 transition-colors"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="text-white hover:text-blue-200 transition-colors"
                    onClick={toggleMenu}
                  >
                    Orders
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="text-white hover:text-blue-200 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/auth/login" 
                    className="text-white hover:text-blue-200 transition-colors"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/auth/register" 
                    className="text-white hover:text-blue-200 transition-colors"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
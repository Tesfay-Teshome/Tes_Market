import { Link, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-gradient-animate hover:scale-105 transition-transform duration-300"
          >
            <ShoppingBag className="h-8 w-8" />
            <span className="text-xl font-bold">Tes Market</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="nav-link text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="nav-link text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              className="nav-link text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Contact
            </Link>
            <Link 
              to="/about" 
              className="nav-link text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              About
            </Link>
            <Link 
              to="/faq" 
              className="nav-link text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              FAQ
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <img 
                      src={user?.avatar || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border-2 border-blue-500 hover:border-blue-600 transition-colors"
                    />
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                      {user?.name}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <Link 
                      to="/market" 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-300"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors duration-300"
                    >
                      Orders
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left text-red-600 hover:text-red-700 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="btn-animate px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="btn-animate px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}>
          <div className="py-4 space-y-4">
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Products
            </Link>
            <Link 
              to="/contact" 
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              Contact
            </Link>
            <Link 
              to="/about" 
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              About
            </Link>
            <Link 
              to="/faq" 
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              FAQ
            </Link>

            {isAuthenticated ? (
              <div className="space-y-4">
                <Link 
                  to="/market" 
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
                >
                  Profile
                </Link>
                <Link 
                  to="/orders" 
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-300"
                >
                  Orders
                </Link>
                <button 
                  onClick={logout}
                  className="w-full text-left text-red-600 hover:text-red-700 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/auth/login"
                  className="block px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 text-center transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 text-center transition-colors duration-300"
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
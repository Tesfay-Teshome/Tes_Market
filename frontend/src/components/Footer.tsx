import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail,
  Phone,
  MapPin,
  Send,
  CreditCard,
  ShieldCheck,
  Truck,
  Clock,
  Heart,
  Gift,
  Award,
  Users
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-800/90 to-purple-800/90 text-white">
      <div className="container mx-auto px-4">
        {/* Features Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-8 w-8 text-blue-400" />
            <div>
              <h4 className="font-semibold">Secure Payment</h4>
              <p className="text-sm text-gray-300">100% Protected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Truck className="h-8 w-8 text-blue-400" />
            <div>
              <h4 className="font-semibold">Fast Delivery</h4>
              <p className="text-sm text-gray-300">Worldwide Shipping</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-400" />
            <div>
              <h4 className="font-semibold">24/7 Support</h4>
              <p className="text-sm text-gray-300">Always Available</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Gift className="h-8 w-8 text-blue-400" />
            <div>
              <h4 className="font-semibold">Special Offers</h4>
              <p className="text-sm text-gray-300">Daily Deals</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Tes Market
            </h3>
            <p className="text-gray-300">
              Your one-stop marketplace for all your shopping needs. Quality products, trusted vendors, secure transactions.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Trusted by 1M+ Customers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">10K+ Active Vendors</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">98% Satisfaction Rate</span>
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Popular Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/category/electronics" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-1">
                <span>Electronics</span>
              </Link>
              <Link to="/category/fashion" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-1">
                <span>Fashion</span>
              </Link>
              <Link to="/category/home" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-1">
                <span>Home & Garden</span>
              </Link>
              <Link to="/category/sports" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-1">
                <span>Sports</span>
              </Link>
              <Link to="/category/beauty" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-1">
                <span>Beauty</span>
              </Link>
              <Link to="/category/toys" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-1">
                <span>Toys & Games</span>
              </Link>
              <Link to="/category/books" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-1">
                <span>Books</span>
              </Link>
              <Link to="/category/automotive" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-1">
                <span>Automotive</span>
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/track-order" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Shipping Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-2">
                  <Gift className="h-4 w-4" />
                  <span>Returns & Exchanges</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-300 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Download & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Stay Connected
            </h3>
            <p className="text-gray-300">
              Get exclusive offers and updates straight to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-r-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-300 mb-2">Accepted Payments</p>
              <div className="flex items-center space-x-6">
                {/* Visa */}
                <svg
                  className="h-8"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="48" height="48" rx="8" fill="#1A1F71"/>
                  <path
                    d="M31.5 16L20 32H16L12 19C11.8 18.4 11.6 18.2 11 18L7 17L7 16H14C14.9 16 15.7 16.6 15.8 17.5L18 27L25 16H31.5Z"
                    fill="white"
                  />
                  <path
                    d="M41 16L37 32H33L37 16H41Z"
                    fill="white"
                  />
                  <path
                    d="M35 16L29 32H25L31 16H35Z"
                    fill="white"
                  />
                </svg>

                {/* Mastercard */}
                <svg
                  className="h-8"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="48" height="48" rx="8" fill="#000"/>
                  <circle cx="18" cy="24" r="10" fill="#EB001B"/>
                  <circle cx="30" cy="24" r="10" fill="#F79E1B"/>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 31.9C26.4 29.8 28 26.6 28 23C28 19.4 26.4 16.2 24 14.1C21.6 16.2 20 19.4 20 23C20 26.6 21.6 29.8 24 31.9Z"
                    fill="#FF5F00"
                  />
                </svg>

                {/* PayPal */}
                <svg
                  className="h-8"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="48" height="48" rx="8" fill="#003087"/>
                  <path
                    d="M34 20C34 24.4 30.4 28 26 28H20L18 38H14L12 28H8L12 16H24C29.5 16 34 17.8 34 20Z"
                    fill="white"
                  />
                  <path
                    d="M38 16C38 20.4 34.4 24 30 24H24L22 34H18L16 24H12L16 12H28C33.5 12 38 13.8 38 16Z"
                    fill="#009CDE"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Tes Market. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
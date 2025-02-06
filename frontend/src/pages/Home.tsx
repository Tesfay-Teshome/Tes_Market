import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  Users,
  Package,
  DollarSign,
  UserPlus,
  BookOpen
} from 'lucide-react';
import axios from '../utils/axios';
import { toast } from 'react-hot-toast';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

interface Stats {
  customers: number;
  vendors: number;
  products: number;
  transactions: number;
}

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get('/api/products/featured/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    toast.error('Failed to load featured products');
    return [];
  }
};

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get('/api/categories/');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    toast.error('Failed to load categories');
    return [];
  }
};

const fetchStats = async (): Promise<Stats> => {
  try {
    const response = await axios.get('/api/stats/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    toast.error('Failed to load stats');
    return {
      customers: 0,
      vendors: 0,
      products: 0,
      transactions: 0,
    };
  }
};

// Sample testimonials (these usually don't come from the backend)
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Buyer',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    content: 'Amazing marketplace! Found exactly what I was looking for at a great price.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Vendor',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    content: 'Great platform for sellers. Easy to manage products and reach customers.',
    rating: 5,
  },
];

const Home = () => {
  const { 
    data: featuredProducts = [],
    isLoading: productsLoading
  } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: fetchFeaturedProducts,
    retry: 1
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    retry: 1
  });

  const {
    data: stats = {
      customers: 0,
      vendors: 0,
      products: 0,
      transactions: 0
    },
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    retry: 1
  });

  // Show loading state
  if (productsLoading && categoriesLoading && statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const renderFeaturedProducts = () => {
    if (!Array.isArray(featuredProducts) || featuredProducts.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No featured products available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  const renderCategories = () => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No categories available</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.id}`}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={category.image}
                alt={category.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                <p className="text-white/80 text-sm">{category.productCount} Products</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Animation */}
      <section className="relative min-h-[calc(100vh-4rem)] py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-xy"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Your One-Stop Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 animate-slide-up">
              Join thousands of satisfied customers buying and selling products in our secure marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/market"
                className="btn-fancy px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Shopping
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/auth/login"
                className="btn-outline-fancy px-8 py-4 text-lg font-semibold text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Become a Vendor
                <UserPlus className="inline-block ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Design */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Why Choose Tes Market?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShoppingBag className="h-8 w-8" />,
                title: 'Wide Selection',
                description: 'Browse through thousands of products from trusted vendors.'
              },
              {
                icon: <Truck className="h-8 w-8" />,
                title: 'Fast Delivery',
                description: 'Get your products delivered quickly and efficiently.'
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Secure Shopping',
                description: 'Shop with confidence with our secure payment system.'
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: '24/7 Support',
                description: 'Our customer support team is always here to help.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="card-hover-fancy glass-morphism p-8 rounded-xl text-center transform-3d"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-50 rounded-full text-blue-600 floating">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gradient-fancy">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Enhanced Animation */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gradient-fancy">Our Growing Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 mx-auto rounded-2xl shadow-lg flex items-center justify-center mb-4 transform rotate-3">
                <Users className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2 text-gradient-fancy">
                {(stats?.customers || 0).toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>

            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 mx-auto rounded-2xl shadow-lg flex items-center justify-center mb-4 transform -rotate-3">
                <ShoppingBag className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2 text-gradient-fancy">
                {(stats?.vendors || 0).toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Trusted Vendors</div>
            </div>

            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 mx-auto rounded-2xl shadow-lg flex items-center justify-center mb-4 transform rotate-3">
                <Package className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2 text-gradient-fancy">
                {(stats?.products || 0).toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Quality Products</div>
            </div>

            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 mx-auto rounded-2xl shadow-lg flex items-center justify-center mb-4 transform -rotate-3">
                <DollarSign className="h-8 w-8 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2 text-gradient-fancy">
                {(stats?.transactions || 0).toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Successful Sales</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gradient-fancy">Featured Products</h2>
            <Link
              to="/products"
              className="link-underline inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          {renderFeaturedProducts()}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 glass-morphism relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 animate-gradient-xy"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl font-bold mb-12 text-center text-gradient-fancy">Shop by Category</h2>
          {renderCategories()}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-95"></div>
            <div className="relative py-16 px-8 md:px-16">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6 text-white">
                  Start Selling on Tes Market
                </h2>
                <p className="text-xl mb-10 text-white">
                  Join our community of successful vendors and start growing your business today.
                  We provide all the tools you need to reach customers worldwide.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <Link
                    to="/auth/login"
                    className="btn-fancy px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Register as Vendor
                    <ArrowRight className="inline-block ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/market"
                    className="btn-outline-fancy px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-white/10 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Learn More
                    <BookOpen className="inline-block ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center text-gradient-fancy">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="card-hover-fancy glass-morphism p-8 rounded-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-2 border-blue-500 mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center gradient-text">Why Choose Tes Market</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
                title: 'Quality Assurance',
                description: 'All our vendors are carefully vetted to ensure high-quality products and service.'
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: 'Secure Payments',
                description: 'Your transactions are protected with industry-standard security measures.'
              },
              {
                icon: <Users className="h-8 w-8 text-blue-600" />,
                title: 'Community Support',
                description: 'Join a thriving community of buyers and sellers from around the world.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="card-hover text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
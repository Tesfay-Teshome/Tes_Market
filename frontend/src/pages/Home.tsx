import React from 'react';
import { ArrowRight, ShoppingBag, Truck, Shield, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      title: "Premium Headphones",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      vendor: "Audio Tech Pro"
    },
    {
      id: 2,
      title: "Smart Watch",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
      vendor: "Tech Gear"
    },
    {
      id: 3,
      title: "Wireless Earbuds",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
      vendor: "Sound Masters"
    },
    {
      id: 4,
      title: "Digital Camera",
      price: 599.99,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
      vendor: "Photo Pro"
    }
  ];

  const categories = [
    {
      id: 1,
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
      count: "1.2k+ products"
    },
    {
      id: 2,
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
      count: "3k+ products"
    },
    {
      id: 3,
      name: "Home & Living",
      image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80",
      count: "2.5k+ products"
    },
    {
      id: 4,
      name: "Sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
      count: "800+ products"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Buyer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      content: "Amazing platform! Found unique products from trusted vendors. The quality and service exceeded my expectations."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Vendor",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      content: "As a vendor, this platform has helped me reach more customers and grow my business significantly."
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Buyer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      content: "The variety of products and secure payment system make shopping here a breeze!"
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl font-bold mb-4 max-w-2xl">Discover Amazing Products from Trusted Vendors</h1>
          <p className="text-xl mb-8 max-w-xl">Join thousands of satisfied customers shopping from our curated selection of quality products.</p>
          <div className="flex gap-4">
            <Link to="/products" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/vendor/register" className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium">
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold">Wide Selection</h3>
              <p className="text-sm text-gray-600">Thousands of products</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Truck className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick & reliable shipping</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Payments</h3>
              <p className="text-sm text-gray-600">100% protected</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-gray-600 mt-2">Handpicked products from our trusted vendors</p>
          </div>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                    Quick View
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{product.vendor}</p>
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-indigo-600 font-bold">${product.price}</p>
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-gray-600 text-sm ml-1">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600">Explore our wide range of categories</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="relative group overflow-hidden rounded-xl"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex flex-col justify-end p-6">
                  <h3 className="text-white font-semibold text-xl mb-1">{category.name}</h3>
                  <p className="text-gray-200 text-sm">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-gray-600">Trusted by thousands of buyers and sellers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
              <div className="flex items-center text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">Start Selling Today</h2>
              <p className="text-indigo-100 max-w-xl">Join our community of successful vendors and reach thousands of customers. Low commission rates and powerful tools to grow your business.</p>
            </div>
            <Link 
              to="/vendor/register"
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg font-medium whitespace-nowrap"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ChevronRight, Heart, Package, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import FadeIn from '@/components/animations/FadeIn';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { productsAPI, categoriesAPI, testimonialsAPI } from '@/services/api';
import { Product, Category, Testimonial } from '@/types';
import { useQuery } from '@tanstack/react-query';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await productsAPI.getFeatured();
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const response = await testimonialsAPI.getAll();
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const isLoading = testimonials === undefined || categories === undefined || featuredProducts === undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const defaultTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      content: "I've been shopping here for months and the quality never disappoints. The vendor verification process really makes a difference!",
      rating: 5,
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Verified Vendor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      content: "As a vendor, the platform provides all the tools I need to reach customers and grow my business.",
      rating: 5,
      is_active: true,
      created_at: "",
      updated_at: ""
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "Fashion Enthusiast",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      content: "The variety of products and competitive prices keep me coming back. Best marketplace experience!",
      rating: 5,
      is_active: true,
      created_at: "",
      updated_at: ""
    },
  ];

  const displayTestimonials = testimonials?.length > 0 ? testimonials : defaultTestimonials;

  // Hero images for carousel
  const heroImages = [
    {
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      title: "Discover Amazing Products",
      subtitle: "From Trusted Vendors Worldwide",
    },
    {
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      title: "Quality Guaranteed",
      subtitle: "Every Product Verified by Our Team",
    },
    {
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
      title: "Special Discounts",
      subtitle: "Save Big on Featured Items",
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          className="h-[600px]"
        >
          {heroImages.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                  >
                    {slide.title}
                    <br />
                    <span className="text-yellow-400">{slide.subtitle}</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl"
                  >
                    Your one-stop shop for quality products at competitive prices
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Link
                      to="/products"
                      className="inline-flex items-center px-8 py-3 rounded-full bg-white text-blue-600 font-semibold text-lg hover:bg-gray-100 transition-colors"
                    >
                      Start Shopping
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-8 py-3 rounded-full border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      Become a Vendor
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
              <p className="text-lg text-gray-600">Experience the best online marketplace with these amazing features</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FadeIn delay={0.1}>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                <div className="bg-blue-600 text-white p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Quality Products</h3>
                <p className="text-gray-600">
                  Curated selection of high-quality products from trusted vendors
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                <div className="bg-green-600 text-white p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure Shopping</h3>
                <p className="text-gray-600">
                  Safe and secure payment methods with buyer protection
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                <div className="bg-purple-600 text-white p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
                <p className="text-gray-600">
                  Quick and reliable shipping options worldwide
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
                <div className="bg-orange-600 text-white p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Customer Love</h3>
                <p className="text-gray-600">
                  Dedicated support team to help you with any questions
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts ? (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                  <p className="text-lg text-gray-600">Discover our handpicked selection of top products</p>
                </div>
                <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  View All
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <FadeIn key={product.id} delay={index * 0.1} direction="up">
                  <Link to={`/products/${product.slug}`} className="group">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover-card">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={typeof product.name === 'string' ? product.name : 'Product Image'}
                          className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-xs font-bold">
                          Featured
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-2">(5.0)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            ${product.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            {product.stock} in stock
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No featured products available</p>
        </div>
      )}

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Categories</h2>
                  <p className="text-lg text-gray-600">Explore our wide range of product categories</p>
                </div>
                <Link to="/categories" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  View All
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {categories.slice(0, 8).map((category, index) => (
                <FadeIn key={category.id} delay={index * 0.1} direction="up">
                  <Link to={`/products?category=${category.slug}`} className="group">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover-card">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-40 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-white" />
                        </div>
                      )}
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-200">Active Users</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Products</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Secure Transactions</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-lg text-gray-600">Don't just take our word for it</p>
            </div>
          </ScrollReveal>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {displayTestimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white p-8 rounded-xl shadow-lg h-full">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">&ldquo;{testimonial.content}&rdquo;</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">Join thousands of satisfied customers today and discover the best products from verified vendors worldwide.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Browse Products
                </Link>
                <Link
                  to="/register"
                  className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Create an Account
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
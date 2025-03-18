import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Heart, Star } from 'lucide-react';
import { productsAPI, categoriesAPI } from '@/services/api';
import { Product, Category } from '@/types';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/slices/cartSlice';
import { useToast } from '@/components/ui/use-toast';
import FadeIn from '@/components/animations/FadeIn';

const Products = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [location.search]);

  // Fetch categories
  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      return Array.isArray(response.data) ? response.data : []; // Ensure this returns an array
    },
  });

  // Fetch products with filters
  const { data: productsData, error: productsError } = useQuery<Product[]>({
    queryKey: ['products', searchTerm, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      const params: Record<string, any> = {};
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (sortBy) params.ordering = sortBy;
      
      // Price range would typically be handled by the backend
      params.min_price = priceRange[0];
      params.max_price = priceRange[1];
      
      const response = await productsAPI.getAll(params);
      return Array.isArray(response.data) ? response.data : []; // Ensure this returns an array
    },
  });

  const handleAddToCart = (product: Product) => {
    dispatch(
      addItem({
        id: crypto.randomUUID(),
        product,
        quantity: 1,
        subtotal: product.price,
      })
    );
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (_productId: string) => {
    // This would typically call the wishlist API
    toast({
      title: 'Added to wishlist',
      description: 'Product has been added to your wishlist successfully.',
    });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (!productsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {Array.isArray(categoriesData) ? categoriesData.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              )) : null}
            </select>
            <button 
              onClick={toggleFilter}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Min"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Default</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-created_at">Newest First</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setPriceRange([0, 1000]);
                    setSortBy('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {Array.isArray(productsData) && productsData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsData.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.05} direction="up">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover-card">
                <Link to={`/products/${product.slug}`} className="block">
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover object-center"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product.slug}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
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
                  </Link>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product.id)}
                      className="p-2 text-gray-500 hover:text-red-500 border border-gray-200 rounded-md hover:border-red-500 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default Products;
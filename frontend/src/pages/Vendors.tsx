import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Store, Star, Package, ShoppingBag, Check } from 'lucide-react';
import api from '@/lib/axios';
import { User } from '@/types';
import FadeIn from '@/components/animations/FadeIn';

const Vendors = () => {
  const { data: vendorsData, error: vendorsError } = useQuery<User[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await api.get('/users/?user_type=vendor&is_verified=true');
      return Array.isArray(response.data) ? response.data : []; // Ensure this returns an array
    },
  });

  if (vendorsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">An error occurred while fetching vendors.</div>
      </div>
    );
  }

  const vendors = vendorsData;

  if (!vendors) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Trusted Vendors</h1>
        <p className="text-lg text-gray-600">
          Discover quality products from verified sellers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vendors?.map((vendor, index) => (
          <FadeIn key={vendor.id} delay={index * 0.1}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {vendor.profile_image ? (
                    <img
                      src={vendor.profile_image}
                      alt={vendor.store_name || vendor.username}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {vendor.store_name || vendor.username}
                    </h3>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-gray-600 text-sm">(5.0)</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {vendor.store_description || 'Quality products from a verified vendor.'}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    <span>Fast Shipping</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-green-500">Verified</span>
                  </div>
                </div>

                <Link
                  to={`/products?vendor=${vendor.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Products
                </Link>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default Vendors;
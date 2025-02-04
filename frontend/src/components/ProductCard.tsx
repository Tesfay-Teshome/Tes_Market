import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps extends Omit<Product, 'images' | 'description' | 'vendorId' | 'category' | 'stock' | 'createdAt' | 'updatedAt'> {
  imageUrl?: string;
  description?: string;
  vendor?: string;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  imageUrl,
  description,
  vendor,
  onAddToCart,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link to={`/products/${id}`}>
        <div className="relative pb-[100%]">
          <img
            src={imageUrl || '/placeholder-product.jpg'}
            alt={title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-blue-600">
            {title}
          </h3>
        </Link>
        {vendor && <p className="text-sm text-gray-600 mb-2">by {vendor}</p>}
        {description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

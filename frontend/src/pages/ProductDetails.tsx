import React, { useState } from 'react';
import { Star, Truck, Shield, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);

  const product = {
    title: "Premium Wireless Headphones",
    price: 299.99,
    rating: 4.8,
    reviews: 245,
    description: "Experience premium sound quality with our wireless headphones. Features include active noise cancellation, 30-hour battery life, and premium comfort.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80",
    ],
    variants: [
      { name: "Black", inStock: true },
      { name: "White", inStock: true },
      { name: "Blue", inStock: false },
    ],
    specifications: [
      { name: "Brand", value: "AudioTech" },
      { name: "Model", value: "AT-2000" },
      { name: "Connectivity", value: "Bluetooth 5.0" },
      { name: "Battery Life", value: "30 hours" },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="aspect-w-1 aspect-h-1 mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-xl"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{product.rating}</span>
                <span className="ml-1 text-gray-600">({product.reviews} reviews)</span>
              </div>
              <button className="text-gray-600 hover:text-gray-900">
                <Heart className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            <p className="text-3xl font-bold text-indigo-600">${product.price}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.name}
                  onClick={() => setSelectedVariant(variant.name)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedVariant === variant.name
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200'
                  } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!variant.inStock}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center border rounded-lg w-32">
              <button
                className="p-2 hover:bg-gray-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full text-center border-0 focus:ring-0"
              />
              <button
                className="p-2 hover:bg-gray-50"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700">
              Add to Cart
            </button>
            <button className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800">
              Buy Now
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Truck className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-medium">Free Delivery</h4>
                <p className="text-sm text-gray-600">Orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Shield className="h-6 w-6 text-gray-600" />
              <div>
                <h4 className="font-medium">2 Year Warranty</h4>
                <p className="text-sm text-gray-600">Full coverage</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h3 className="font-semibold mb-4">Product Description</h3>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <h3 className="font-semibold mb-4">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              {product.specifications.map((spec) => (
                <div key={spec.name} className="flex justify-between">
                  <span className="text-gray-600">{spec.name}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PaymentForm from '../components/PaymentForm';

interface CartItem {
  id: number;
  product: {
    id: number;
    title: string;
    price: number;
  };
  quantity: number;
  total: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>('');

  const { data: cartItems, isLoading } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await axios.get('/api/cart/');
      return response.data;
    },
  });

  useEffect(() => {
    if (cartItems) {
      const total = cartItems.reduce((sum, item) => sum + item.total, 0);
      setOrderTotal(total);
    }
  }, [cartItems]);

  const handlePaymentSuccess = async () => {
    try {
      // Clear the cart after successful payment
      await axios.delete('/api/cart/');
      navigate('/order-confirmation', { state: { orderId } });
    } catch (err) {
      setError('Failed to process order. Please contact support.');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Order Summary */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {cartItems.map((item) => (
                <div key={item.id} className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{item.product.title}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {item.quantity} x ${item.product.price.toFixed(2)} = ${item.total.toFixed(2)}
                  </dd>
                </div>
              ))}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 sm:mt-0 sm:col-span-2">
                  ${orderTotal.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            <div className="mt-6">
              <PaymentForm
                amount={orderTotal}
                orderId={orderId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

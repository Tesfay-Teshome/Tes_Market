import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Truck } from 'lucide-react';
import api from '@/lib/axios';
import { Order } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const Orders = () => {
  const { toast } = useToast();

  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['vendor-orders'],
    queryFn: async () => {
      const response = await api.get('/vendor/orders/');
      return response.data;
    },
  });

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/vendor/orders/${orderId}/`, { status });
      toast({
        title: 'Success',
        description: 'Order status updated successfully.',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      <div className="space-y-6">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  Placed on{' '}
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleUpdateOrderStatus(order.id, e.target.value)
                  }
                  className="border rounded-md px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      Earning: ${item.vendor_earning.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Shipping Address:
                  <br />
                  {order.shipping_address}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold">
                  ${order.total_amount.toFixed(2)}
                </p>
              </div>
            </div>

            {order.status === 'processing' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Truck className="h-5 w-5 mr-2" />
                  Mark as Shipped
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
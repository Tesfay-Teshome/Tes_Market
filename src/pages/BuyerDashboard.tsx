import React from 'react';
import { Package, Clock, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const BuyerDashboard = () => {
  const orders = [
    {
      id: '1',
      product: 'Premium Headphones',
      vendor: 'Audio Tech Pro',
      status: 'delivered',
      date: '2024-02-28',
      amount: '$299.99'
    },
    {
      id: '2',
      product: 'Smart Watch',
      vendor: 'Tech Gear',
      status: 'shipped',
      date: '2024-02-25',
      amount: '$199.99'
    },
    // Add more orders as needed
  ];

  const stats = [
    {
      label: 'Total Orders',
      value: '12',
      icon: ShoppingBag
    },
    {
      label: 'In Progress',
      value: '3',
      icon: Clock
    },
    {
      label: 'Reviews Given',
      value: '8',
      icon: Star
    },
    {
      label: 'Wishlist Items',
      value: '15',
      icon: Package
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your orders.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
        </div>
        <div className="divide-y">
          {orders.map((order) => (
            <div key={order.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">{order.product}</h3>
                  <p className="text-sm text-gray-600">Sold by {order.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'delivered' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
                <Link 
                  to={`/orders/${order.id}`}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;
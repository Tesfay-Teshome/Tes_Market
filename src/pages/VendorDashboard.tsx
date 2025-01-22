import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  DollarSign, 
  Users, 
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  status: string;
}

interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  date: string;
}

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  const { data: analytics } = useQuery({
    queryKey: ['vendor-analytics', dateRange],
    queryFn: async () => {
      const response = await axios.get(`/api/vendor/analytics/?range=${dateRange}`);
      return response.data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ['vendor-products'],
    queryFn: async () => {
      const response = await axios.get('/api/vendor/products/');
      return response.data;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ['vendor-orders'],
    queryFn: async () => {
      const response = await axios.get('/api/vendor/orders/');
      return response.data;
    },
  });

  const stats = [
    {
      label: 'Total Sales',
      value: analytics?.totalSales ? `$${analytics.totalSales.toFixed(2)}` : '$0',
      change: '+12.3%',
      icon: DollarSign
    },
    {
      label: 'Active Products',
      value: products?.length || '0',
      change: '+3.2%',
      icon: Package
    },
    {
      label: 'Total Customers',
      value: analytics?.totalCustomers || '0',
      change: '+18.7%',
      icon: Users
    },
    {
      label: 'Pending Orders',
      value: orders?.filter(o => o.status === 'pending').length || '0',
      change: '-2.1%',
      icon: ShoppingCart
    }
  ];

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/vendor/products/${productId}/`);
        // Refresh products data
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await axios.patch(`/api/vendor/orders/${orderId}/`, { status });
      // Refresh orders data
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Navigation Tabs */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-4">
          {['overview', 'products', 'orders', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-3 ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <h3 className="text-2xl font-semibold">{stat.value}</h3>
                  </div>
                  <stat.icon className="h-8 w-8 text-blue-500" />
                </div>
                <p className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Order #</th>
                    <th className="text-left py-3">Customer</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3">{order.orderNumber}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">${order.total.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Manage Products</h2>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Link
                to="/vendor/products/new"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Product
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Product</th>
                  <th className="text-left py-3">Price</th>
                  <th className="text-left py-3">Stock</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: Product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-3">{product.title}</td>
                    <td className="py-3">${product.price.toFixed(2)}</td>
                    <td className="py-3">{product.stock}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Link
                          to={`/vendor/products/${product.id}/edit`}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">Manage Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Order #</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-left py-3">Total</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-3">{order.orderNumber}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3">${order.total.toFixed(2)}</td>
                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3">{order.date}</td>
                    <td className="py-3">
                      <Link
                        to={`/vendor/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Sales Analytics</h2>
              <div className="flex space-x-2">
                {['week', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      dateRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
                    <p className="text-2xl font-semibold">${analytics.totalSales.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Average Order Value</h3>
                    <p className="text-2xl font-semibold">${analytics.averageOrderValue.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Commission Paid</h3>
                    <p className="text-2xl font-semibold">${analytics.commissionPaid.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Top Products</h3>
                  <div className="space-y-4">
                    {analytics.topProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-gray-500">{product.sales} sales</p>
                        </div>
                        <p className="font-medium">${product.revenue.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Monthly Sales</h3>
                  <div className="space-y-4">
                    {analytics.monthlySales.map((month) => (
                      <div key={month.month} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{month.month}</p>
                        <p className="font-medium">${month.sales.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
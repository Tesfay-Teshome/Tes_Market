import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { vendorAPI } from '@/services/api';
import { VendorAnalytics } from '@/types';
import FadeIn from '@/components/animations/FadeIn';

const Dashboard = () => {
  const { data: analytics, isLoading } = useQuery<VendorAnalytics>({
    queryKey: ['vendor-analytics'],
    queryFn: async () => {
      const response = await vendorAPI.getAnalytics();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Sales',
      value: `$${analytics?.total_sales?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'bg-green-500',
      link: '/vendor/earnings',
    },
    {
      name: 'Total Orders',
      value: analytics?.total_orders || 0,
      icon: Package,
      color: 'bg-blue-500',
      link: '/vendor/orders',
    },
    {
      name: 'Products Sold',
      value: analytics?.total_products_sold || 0,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      link: '/vendor/products',
    },
    {
      name: 'Net Earnings',
      value: `$${(analytics?.total_earnings ?? 0 - (analytics?.platform_fees || 0)).toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/vendor/earnings',
    },
  ];

  const quickActions = [
    {
      name: 'Add New Product',
      description: 'List a new product for sale',
      icon: ShoppingBag,
      link: '/vendor/products/new',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Pending Orders',
      description: `${analytics?.pending_orders || 0} orders need attention`,
      icon: Clock,
      link: '/vendor/orders?status=pending',
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      name: 'Product Approvals',
      description: `${analytics?.pending_approvals || 0} products awaiting approval`,
      icon: AlertCircle,
      link: '/vendor/products?status=pending',
      color: 'bg-purple-100 text-purple-800',
    },
  ];

  const totalSales = analytics?.total_sales;

  const renderOrders = (orders: any[] | undefined) => {
    if (!orders) return null; // Handle the case where orders are undefined

    return orders.map((order) => (
      <div key={order.id} className="flex items-center gap-4 pb-4 border-b">
        <div className={`p-2 rounded-full ${order.status === 'pending' ? 'bg-green-100' : 'bg-blue-100'}`}> 
          <Package className={`h-5 w-5 ${order.status === 'pending' ? 'text-green-600' : 'text-blue-600'}`} />
        </div>
        <div className="flex-1">
          <p className="font-medium">Order #{order.id}</p>
          <p className="text-sm text-gray-500">{order.created_at}</p>
        </div>
        <span className="text-lg font-semibold">${order.amount}</span>
      </div>
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <Link
          to="/vendor/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" />
          Add New Product
        </Link>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-4 rounded-lg text-white mr-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-900">{action.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FadeIn>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {renderOrders(analytics?.recent_orders)}
            </div>
            <Link
              to="/vendor/orders"
              className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              View all orders
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Product Performance</h2>
            <div className="space-y-4">
              {analytics?.top_products?.map((product) => (
                <div key={product.id} className="flex items-center gap-4 pb-4 border-b">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.total_sales} sales
                    </p>
                  </div>
                  <span className="text-lg font-semibold">
                    ${product.revenue}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/vendor/products"
              className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
            >
              View all products
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Platform Fees and Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Platform Fees</h2>
          <div className="text-3xl font-bold text-red-600 mb-2">
            ${Number(analytics?.platform_fees).toFixed(2)}
          </div>
          <p className="text-gray-600">Total platform fees deducted</p>
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Fee Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Transaction Fee (2.5%)</span>
                <span>${(totalSales ? (parseFloat(totalSales.toFixed(2)) * 0.025) : 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Commission (5%)</span>
                <span>${totalSales ? (parseFloat(totalSales.toFixed(2)) * 0.05).toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Net Earnings</h2>
          <div className="text-3xl font-bold text-green-600 mb-2">
            ${(analytics?.total_earnings || 0 - (analytics?.platform_fees || 0)).toFixed(2)}
          </div>
          <p className="text-gray-600">Total earnings after platform fees</p>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Next payout scheduled for {analytics?.next_payout_date ?? 'N/A'}</span>
            </div>
            <Link
              to="/vendor/earnings"
              className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              View Earnings Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
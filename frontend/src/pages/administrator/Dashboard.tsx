import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  ShoppingBag, 
  CreditCard, 
  Store, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAPI } from '@/services/api';
import { AdminDashboardMetrics } from '@/types';
import FadeIn from '@/components/animations/FadeIn';

const Dashboard = () => {
  const { data: metrics, isLoading } = useQuery<AdminDashboardMetrics>({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const response = await adminAPI.getMetrics();
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
      name: 'Total Users',
      value: metrics?.total_users || 0,
      icon: Users,
      color: 'bg-blue-500',
      link: '/administrator/users',
    },
    {
      name: 'Total Products',
      value: metrics?.total_products || 0,
      icon: ShoppingBag,
      color: 'bg-green-500',
      link: '/administrator/products',
    },
    {
      name: 'Total Sales',
      value: `$${metrics?.total_sales ? metrics.total_sales.toFixed(2) : '0.00'}`,
      icon: CreditCard,
      color: 'bg-purple-500',
      link: '/administrator/transactions',
    },
    {
      name: 'Total Vendors',
      value: metrics?.total_vendors || 0,
      icon: Store,
      color: 'bg-orange-500',
      link: '/administrator/vendors',
    },
  ];

  const quickActions = [
    {
      name: 'Pending Vendor Approvals',
      value: metrics?.pending_vendor_approvals || 0,
      icon: Store,
      color: 'bg-yellow-100 text-yellow-800',
      link: '/administrator/vendors?status=pending',
    },
    {
      name: 'Pending Product Approvals',
      value: metrics?.pending_product_approvals || 0,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-800',
      link: '/administrator/products?status=pending',
    },
    {
      name: 'Pending Transactions',
      value: metrics?.pending_transactions || 0,
      icon: CreditCard,
      color: 'bg-purple-100 text-purple-800',
      link: '/administrator/transactions?status=pending',
    },
    {
      name: 'Reported Issues',
      value: metrics?.reported_issues || 0,
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-800',
      link: '/administrator/issues',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Administrator Dashboard</h1>
        <p>Welcome to the Administrator Dashboard. Here you can manage users, products, categories, and transactions.</p>
      </div>

      {/* Main Stats */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">{action.value}</span>
            </div>
            <h3 className="font-medium text-gray-900">{action.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Click to view details</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FadeIn>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {/* Activity Items */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">New vendor approved</p>
                  <p className="text-sm text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="bg-blue-100 p-2 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">New product listed</p>
                  <p className="text-sm text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Transaction pending approval</p>
                  <p className="text-sm text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Revenue Analytics</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${metrics?.daily_revenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Monthly Growth</p>
                <p className="text-2xl font-bold text-blue-600">
                  +{metrics?.monthly_growth || 0}%
                </p>
              </div>
            </div>
            {/* Add Chart Component Here */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Revenue Chart</p>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <div>
              <p className="font-medium">API Status</p>
              <p className="text-sm text-gray-500">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <div>
              <p className="font-medium">Payment System</p>
              <p className="text-sm text-gray-500">Operational</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <div>
              <p className="font-medium">Storage System</p>
              <p className="text-sm text-gray-500">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
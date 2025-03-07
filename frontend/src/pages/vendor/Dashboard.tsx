import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, DollarSign, Package, TrendingUp } from 'lucide-react';
import api from '@/lib/axios';
import { VendorAnalytics } from '@/types';

const Dashboard = () => {
  const { data: analytics, isLoading } = useQuery<VendorAnalytics>({
    queryKey: ['vendor-analytics'],
    queryFn: async () => {
      const response = await api.get('/vendor/analytics/');
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
      value: `$${analytics?.total_sales.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Total Orders',
      value: analytics?.total_orders || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Products Sold',
      value: analytics?.total_products_sold || 0,
      icon: ShoppingBag,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Earnings',
      value: `$${analytics?.total_earnings.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-md p-6 flex items-center"
          >
            <div
              className={`${stat.color} p-4 rounded-lg text-white mr-4`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibol d mb-4">Platform Fees</h2>
          <div className="text-3xl font-bold text-red-600">
            ${analytics?.platform_fees.toFixed(2) || '0.00'}
          </div>
          <p className="text-gray-600">Total platform fees deducted</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Net Earnings</h2>
          <div className="text-3xl font-bold text-green-600">
            ${(analytics?.total_earnings - (analytics?.platform_fees || 0)).toFixed(2)}
          </div>
          <p className="text-gray-600">Total earnings after platform fees</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
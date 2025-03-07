import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ShoppingBag, CreditCard, Store } from 'lucide-react';
import api from '@/lib/axios';
import { AdminDashboardMetrics } from '@/types';

const Dashboard = () => {
  const { data: metrics, isLoading } = useQuery<AdminDashboardMetrics>({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const response = await api.get('/admin/metrics/');
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
    },
    {
      name: 'Total Products',
      value: metrics?.total_products || 0,
      icon: ShoppingBag,
      color: 'bg-green-500',
    },
    {
      name: 'Total Sales',
      value: `$${metrics?.total_sales.toFixed(2) || '0.00'}`,
      icon: CreditCard,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Vendors',
      value: metrics?.total_vendors || 0,
      icon: Store,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

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
          <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
          <div className="text-3xl font-bold text-blue-600">
            {metrics?.pending_approvals || 0}
          </div>
          <p className="text-gray-600">Products waiting for approval</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Payouts</h2>
          <div className="text-3xl font-bold text-green-600">
            {metrics?.pending_payouts || 0}
          </div>
          <p className="text-gray-600">Vendor payouts to process</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
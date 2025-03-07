import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import api from '@/lib/axios';
import { VendorAnalytics } from '@/types';

const Earnings = () => {
  const { data: analytics, isLoading } = useQuery<VendorAnalytics>({
    queryKey: ['vendor-earnings'],
    queryFn: async () => {
      const response = await api.get('/vendor/earnings/');
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Earnings Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-500 p-4 rounded-lg text-white mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold">
                ${analytics?.total_earnings.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-center text-green-500">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 p-4 rounded-lg text-white mr-4">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Platform Fees</p>
              <p className="text-2xl font-bold">
                ${analytics?.platform_fees.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Platform fee rate: 10% of total sales
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 p-4 rounded-lg text-white mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Earnings</p>
              <p className="text-2xl font-bold">
                ${(analytics?.total_earnings - (analytics?.platform_fees || 0)).toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Total earnings after platform fees
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Earnings</h2>
          {/* Add chart component here */}
          <div className="h-64 bg-gray-100 rounded-lg"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          <div className="space-y-4">
            {/* Add payment history list here */}
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">January Payout</p>
                <p className="text-sm text-gray-500">Jan 31, 2024</p>
              </div>
              <span className="text-green-600 font-medium">$1,234.56</span>
            </div>
            {/* Add more payment history items */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
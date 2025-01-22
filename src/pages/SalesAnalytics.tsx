import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface SalesData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  commissionPaid: number;
  topProducts: {
    id: number;
    title: string;
    sales: number;
    revenue: number;
  }[];
  monthlySales: {
    month: string;
    sales: number;
  }[];
}

const SalesAnalytics = () => {
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'year'

  const { data, isLoading, error } = useQuery<SalesData>({
    queryKey: ['sales-analytics', dateRange],
    queryFn: async () => {
      const response = await axios.get(`/api/vendor/analytics/?range=${dateRange}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading analytics. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
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

      {data && (
        <>
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Sales
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  ${data.totalSales.toFixed(2)}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Orders
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {data.totalOrders}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Average Order Value
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  ${data.averageOrderValue.toFixed(2)}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Commission Paid
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  ${data.commissionPaid.toFixed(2)}
                </dd>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
              <div className="space-y-4">
                {data.topProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${product.revenue.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Sales</h3>
              <div className="space-y-4">
                {data.monthlySales.map((month) => (
                  <div key={month.month} className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">{month.month}</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${month.sales.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesAnalytics;

import { useEffect, useState } from 'react';
import axios from '../../utils/axios';

interface DashboardStats {
  products_count: number;
  orders_count: number;
  total_earnings: number;
  is_verified: boolean;
}

export default function VendorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/vendor/dashboard/');
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>

      {!stats.is_verified && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg">
          <p className="font-medium">Your account is pending verification. Some features may be limited.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Products</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{stats.products_count}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Orders</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{stats.orders_count}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Earnings</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            ${stats.total_earnings.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
          {/* Add recent orders list here */}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Products</h3>
          {/* Add popular products list here */}
        </div>
      </div>
    </div>
  );
}

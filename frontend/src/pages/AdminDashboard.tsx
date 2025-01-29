import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Users,
  Store,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  TrendingUp,
  Settings,
  Bell
} from 'lucide-react';

interface VendorPayout {
  id: string;
  vendor: string;
  amount: string;
  items: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Analytics {
  totalSales: number;
  totalCommission: number;
  totalVendors: number;
  totalBuyers: number;
  topVendors: {
    id: number;
    username: string;
    sales: number;
    revenue: number;
  }[];
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [commissionRate, setCommissionRate] = useState(10);

  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/analytics/');
      return response.data;
    },
  });

  const stats = [
    {
      label: 'Total Vendors',
      value: analytics?.totalVendors || 0,
      change: '+12.3%',
      icon: Store
    },
    {
      label: 'Total Buyers',
      value: analytics?.totalBuyers || 0,
      change: '+8.1%',
      icon: Users
    },
    {
      label: 'Total Revenue',
      value: `$${analytics?.totalSales.toFixed(2) || '0'}`,
      change: '+23.5%',
      icon: DollarSign
    },
    {
      label: 'Commission Earned',
      value: `$${analytics?.totalCommission.toFixed(2) || '0'}`,
      change: '+15.2%',
      icon: TrendingUp
    }
  ];

  const pendingPayouts: VendorPayout[] = [
    {
      id: '1',
      vendor: 'Tech Gear Store',
      amount: '$1,299.99',
      items: 5,
      date: '2024-02-28',
      status: 'pending'
    },
    {
      id: '2',
      vendor: 'Fashion Hub',
      amount: '$899.50',
      items: 3,
      date: '2024-02-27',
      status: 'pending'
    }
  ];

  const handlePayoutAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await axios.post(`/api/admin/payouts/${id}/${action}`);
      // Refresh data
    } catch (error) {
      console.error('Error processing payout:', error);
    }
  };

  const handleCommissionUpdate = async () => {
    try {
      await axios.post('/api/admin/settings/commission', { rate: commissionRate });
      // Show success message
    } catch (error) {
      console.error('Error updating commission rate:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Navigation Tabs */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-4">
          {['overview', 'vendors', 'payouts', 'settings'].map((tab) => (
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
          {/* Stats Grid */}
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

          {/* Top Vendors */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Top Performing Vendors</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Vendor</th>
                    <th className="text-left py-3">Total Sales</th>
                    <th className="text-left py-3">Revenue</th>
                    <th className="text-left py-3">Commission Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.topVendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b">
                      <td className="py-3">{vendor.username}</td>
                      <td className="py-3">{vendor.sales}</td>
                      <td className="py-3">${vendor.revenue.toFixed(2)}</td>
                      <td className="py-3">${(vendor.revenue * 0.1).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Manage Vendors</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search vendors..."
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          {/* Vendor list would go here */}
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Pending Payouts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Vendor</th>
                  <th className="text-left py-3">Amount</th>
                  <th className="text-left py-3">Items</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayouts.map((payout) => (
                  <tr key={payout.id} className="border-b">
                    <td className="py-3">{payout.vendor}</td>
                    <td className="py-3">{payout.amount}</td>
                    <td className="py-3">{payout.items}</td>
                    <td className="py-3">{payout.date}</td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePayoutAction(payout.id, 'approve')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handlePayoutAction(payout.id, 'reject')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <XCircle className="h-5 w-5" />
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

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">Platform Settings</h2>
          
          <div className="max-w-md">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Commission Rate (%)
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="block w-32 px-3 py-2 border rounded-md"
                  min="0"
                  max="100"
                />
                <button
                  onClick={handleCommissionUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Notification Settings</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2">Email notifications for new vendors</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2">Email notifications for large transactions</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2">Daily summary reports</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
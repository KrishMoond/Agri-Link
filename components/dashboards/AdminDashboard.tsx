import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../src/services/authService';
import transactionService from '../../src/services/transactionService';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    transactions: 0,
    revenue: 0,
    disputes: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        navigate('/login');
        return;
      }

      const analytics = await transactionService.getAnalytics();
      
      setStats({
        users: 150, // Mock data
        transactions: analytics.totalTransactions || 0,
        revenue: analytics.totalRevenue || 0,
        disputes: analytics.disputedTransactions || 0
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform management and oversight</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">{stats.users}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-green-600">{stats.transactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-purple-600">₹{stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Disputes</p>
              <p className="text-2xl font-bold text-red-600">{stats.disputes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Admin Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium">Manage Users</div>
          </button>
          <button
            onClick={() => navigate('/admin/transactions')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-center"
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="text-sm font-medium">Transactions</div>
          </button>
          <button
            onClick={() => navigate('/admin/disputes')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 text-center"
          >
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-sm font-medium">Disputes</div>
          </button>
          <button
            onClick={() => navigate('/admin/analytics')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">Analytics</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
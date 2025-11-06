import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../src/services/authService';
import productService from '../../src/services/productService';
import transactionService from '../../src/services/transactionService';

const BuyerDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    purchases: 0,
    favorites: 0,
    orders: 0,
    spent: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBuyerStats();
  }, []);

  const loadBuyerStats = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !['buyer', 'retailer'].includes(user.role)) {
        navigate('/login');
        return;
      }

      const transactions = await transactionService.getMyTransactions({ limit: 1 });
      
      setStats({
        purchases: transactions.total || 0,
        favorites: 5, // Mock data
        orders: transactions.total || 0,
        spent: 25000 // Mock data
      });
    } catch (error) {
      console.error('Error loading buyer stats:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-600">Browse and purchase fresh products</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Purchases</p>
              <p className="text-2xl font-bold text-green-600">{stats.purchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">❤️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Favorites</p>
              <p className="text-2xl font-bold text-red-600">{stats.favorites}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-blue-600">{stats.orders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">💳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-purple-600">₹{stats.spent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-center"
          >
            <div className="text-2xl mb-2">🛒</div>
            <div className="text-sm font-medium">Browse Products</div>
          </button>
          <button
            onClick={() => navigate('/auctions')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center"
          >
            <div className="text-2xl mb-2">🔨</div>
            <div className="text-sm font-medium">View Auctions</div>
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium">My Orders</div>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 text-center"
          >
            <div className="text-2xl mb-2">💬</div>
            <div className="text-sm font-medium">Messages</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../src/services/authService';
import productService from '../../src/services/productService';
import { auctionService } from '../../src/services/auctionService';
import transactionService from '../../src/services/transactionService';

const FarmerDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    auctions: 0,
    sales: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFarmerStats();
  }, []);

  const loadFarmerStats = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || user.role !== 'farmer') {
        navigate('/login');
        return;
      }

      const [products, auctions, transactions] = await Promise.all([
        productService.getProducts({ limit: 1 }),
        auctionService.getActiveAuctions(),
        transactionService.getMyTransactions({ limit: 1 })
      ]);

      const auctionCount = auctions.length;

      setStats({
        products: products.total || 0,
        auctions: auctionCount || 0,
        sales: transactions.total || 0,
        revenue: 50000 // Mock data
      });
    } catch (error) {
      console.error('Error loading farmer stats:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
        <p className="text-gray-600">Manage your products and sales</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🌾</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Products</p>
              <p className="text-2xl font-bold text-green-600">{stats.products}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🔨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Auctions</p>
              <p className="text-2xl font-bold text-blue-600">{stats.auctions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Sales</p>
              <p className="text-2xl font-bold text-purple-600">{stats.sales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-yellow-600">₹{stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/add-product')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-center"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="text-sm font-medium">Add Product</div>
          </button>
          <button
            onClick={() => navigate('/add-item')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center"
          >
            <div className="text-2xl mb-2">🔨</div>
            <div className="text-sm font-medium">Create Auction</div>
          </button>
          <button
            onClick={() => navigate('/my-products')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium">My Products</div>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium">Analytics</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
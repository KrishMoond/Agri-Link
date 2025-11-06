import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../src/services/authService';
import auctionService from '../src/services/auctionService';
import productService from '../src/services/productService';
import transactionService from '../src/services/transactionService';
import chatService from '../src/services/chatService';
import userService from '../src/services/userService';
import { useNotification } from '../src/hooks/useNotification';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  location: {
    state: string;
    district: string;
    village?: string;
    pincode: string;
  };
  profilePicUrl?: string;
  ratings: {
    averageRating: number;
    totalRatings: number;
  };
  statistics: {
    totalTransactions: number;
    totalSales: number;
    totalPurchases: number;
  };
  verification: {
    verificationLevel: string;
  };
}

const EnhancedDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    auctions: 0,
    products: 0,
    transactions: 0,
    unreadMessages: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Load user profile
      const userProfile = await userService.getProfile();
      setUser(userProfile);

      // Load statistics
      await loadStatistics(userProfile);
      
      // Load recent activity
      await loadRecentActivity();
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async (userProfile: User) => {
    try {
      const [auctionsData, productsData, transactionsData, unreadData] = await Promise.all([
        auctionService.getAuctions({ limit: 1 }),
        productService.getProducts({ limit: 1 }),
        transactionService.getMyTransactions({ limit: 1 }),
        chatService.getUnreadCount()
      ]);

      setStats({
        auctions: auctionsData.total || 0,
        products: productsData.total || 0,
        transactions: transactionsData.total || 0,
        unreadMessages: unreadData.unreadCount || 0,
        totalRevenue: userProfile.statistics?.totalSales || 0
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const [recentTransactions, recentChats] = await Promise.all([
        transactionService.getMyTransactions({ limit: 3 }),
        chatService.getMyChats()
      ]);

      const activity = [
        ...recentTransactions.transactions.map(t => ({
          type: 'transaction',
          title: `${t.type === 'direct-purchase' ? 'Purchase' : 'Sale'}: ${t.orderDetails.itemName}`,
          description: `${transactionService.formatAmount(t.orderDetails.totalAmount)} • ${t.delivery.status}`,
          time: t.createdAt,
          icon: '💰'
        })),
        ...recentChats.slice(0, 3).map(c => ({
          type: 'message',
          title: `Message from ${chatService.getOtherParticipant(c, user?._id || '')?.userId.name}`,
          description: c.lastMessage.content.substring(0, 50) + '...',
          time: c.lastMessage.timestamp,
          icon: '💬'
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getVerificationBadge = (level: string) => {
    const badges = {
      unverified: { color: 'bg-gray-100 text-gray-800', text: 'Unverified' },
      basic: { color: 'bg-blue-100 text-blue-800', text: 'Basic' },
      verified: { color: 'bg-green-100 text-green-800', text: 'Verified' },
      premium: { color: 'bg-purple-100 text-purple-800', text: 'Premium' }
    };
    return badges[level as keyof typeof badges] || badges.unverified;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user?.profilePicUrl ? (
                  <img
                    src={user.profilePicUrl}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {/* Verification Badge */}
                <div className="absolute -bottom-1 -right-1">
                  <div className={`px-1 py-0.5 rounded-full text-xs font-medium ${getVerificationBadge(user?.verification?.verificationLevel || 'unverified').color}`}>
                    ✓
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-semibold text-gray-900">Welcome, {user?.name}</h1>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerificationBadge(user?.verification?.verificationLevel || 'unverified').color}`}>
                    {getVerificationBadge(user?.verification?.verificationLevel || 'unverified').text}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="capitalize">{user?.role}</span>
                  {user?.ratings?.averageRating > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span>{user.ratings.averageRating.toFixed(1)} ({user.ratings.totalRatings})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {stats.unreadMessages > 0 && (
                <button
                  onClick={() => navigate('/chat')}
                  className="relative p-2 text-gray-600 hover:text-gray-900"
                >
                  <span className="text-xl">💬</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.unreadMessages}
                  </span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
              { id: 'transactions', label: 'Transactions', icon: '💰' },
              { id: 'messages', label: 'Messages', icon: '💬' },
              ...(user?.role === 'farmer' ? [{ id: 'my-products', label: 'My Products', icon: '🌾' }] : []),
              { id: 'profile', label: 'Profile', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === 'messages' && stats.unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.unreadMessages}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Enhanced Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{stats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Products</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.products}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🌾</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.transactions}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Messages</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.unreadMessages}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user?.role === 'farmer' && (
                  <>
                    <button
                      onClick={() => navigate('/add-product')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
                    >
                      <div className="text-2xl mb-2">➕</div>
                      <div className="text-sm font-medium text-gray-700">Add Product</div>
                    </button>
                    <button
                      onClick={() => navigate('/add-item')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                      <div className="text-2xl mb-2">🔨</div>
                      <div className="text-sm font-medium text-gray-700">Create Auction</div>
                    </button>
                  </>
                )}
                <button
                  onClick={() => navigate('/products')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">🛒</div>
                  <div className="text-sm font-medium text-gray-700">Browse Products</div>
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">💬</div>
                  <div className="text-sm font-medium text-gray-700">Messages</div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.time).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly with enhanced features */}
        {activeTab === 'marketplace' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketplace</h3>
            <p className="text-gray-600 mb-6">Browse and purchase fresh products directly from farmers</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              <button
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
              >
                Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-sm text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-sm text-gray-900">{user?.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <p className="text-sm text-gray-900 capitalize">{user?.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-sm text-gray-900">
                  {user?.location?.village && `${user.location.village}, `}
                  {user?.location?.district}, {user?.location?.state} - {user?.location?.pincode}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getVerificationBadge(user?.verification?.verificationLevel || 'unverified').color}`}>
                  {getVerificationBadge(user?.verification?.verificationLevel || 'unverified').text}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;
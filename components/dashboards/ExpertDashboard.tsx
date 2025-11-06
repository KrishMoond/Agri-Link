import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../src/services/authService';

const ExpertDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    consultations: 0,
    articles: 0,
    rating: 4.8,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadExpertStats();
  }, []);

  const loadExpertStats = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || user.role !== 'expert') {
        navigate('/login');
        return;
      }

      // Mock data for expert stats
      setStats({
        consultations: 45,
        articles: 12,
        rating: 4.8,
        earnings: 15000
      });
    } catch (error) {
      console.error('Error loading expert stats:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Expert Dashboard</h1>
        <p className="text-gray-600">Provide consultation and share knowledge</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Consultations</p>
              <p className="text-2xl font-bold text-blue-600">{stats.consultations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Articles</p>
              <p className="text-2xl font-bold text-green-600">{stats.articles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.rating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Earnings</p>
              <p className="text-2xl font-bold text-purple-600">₹{stats.earnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/consultations')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center"
          >
            <div className="text-2xl mb-2">👨‍🏫</div>
            <div className="text-sm font-medium">Consultations</div>
          </button>
          <button
            onClick={() => navigate('/write-article')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-center"
          >
            <div className="text-2xl mb-2">✍️</div>
            <div className="text-sm font-medium">Write Article</div>
          </button>
          <button
            onClick={() => navigate('/community')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium">Community</div>
          </button>
          <button
            onClick={() => navigate('/schedule')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 text-center"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-medium">Schedule</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
import React, { useState } from 'react';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [newPost, setNewPost] = useState('');

  const discussions = [
    {
      id: 1,
      author: 'Rajesh Kumar',
      avatar: '👨‍🌾',
      title: 'Best practices for organic tomato farming',
      content: 'I\'ve been experimenting with organic methods for tomatoes. Here are some tips that worked for me...',
      likes: 24,
      replies: 8,
      time: '2 hours ago',
      tags: ['organic', 'tomatoes', 'tips']
    },
    {
      id: 2,
      author: 'Priya Sharma',
      avatar: '👩‍🌾',
      title: 'Dealing with pest control in monsoon',
      content: 'The recent rains have brought pest issues. What are your natural pest control methods?',
      likes: 18,
      replies: 12,
      time: '4 hours ago',
      tags: ['pest-control', 'monsoon', 'natural']
    }
  ];

  const experts = [
    {
      id: 1,
      name: 'Dr. Amit Patel',
      specialty: 'Soil Science',
      rating: 4.9,
      consultations: 150,
      avatar: '👨‍🔬',
      available: true
    },
    {
      id: 2,
      name: 'Dr. Sunita Reddy',
      specialty: 'Crop Protection',
      rating: 4.8,
      consultations: 200,
      avatar: '👩‍🔬',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Community</h1>
          <p className="text-gray-600">Connect, learn, and grow together</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'discussions', label: 'Discussions', icon: '💬' },
              { id: 'experts', label: 'Expert Consultation', icon: '👨‍🏫' },
              { id: 'success', label: 'Success Stories', icon: '🏆' },
              { id: 'marketplace', label: 'Knowledge Hub', icon: '📚' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'discussions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Share with the community</h3>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Ask a question, share a tip, or start a discussion..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">#tips</button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">#organic</button>
                  </div>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Post
                  </button>
                </div>
              </div>

              {/* Discussion Posts */}
              {discussions.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{post.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{post.author}</h4>
                        <span className="text-sm text-gray-500">{post.time}</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <button className="flex items-center space-x-1 hover:text-green-600">
                          <span>👍</span>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-green-600">
                          <span>💬</span>
                          <span>{post.replies} replies</span>
                        </button>
                        <button className="hover:text-green-600">Share</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Trending Topics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#organic-farming</span>
                    <span className="text-xs text-gray-500">245 posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#pest-control</span>
                    <span className="text-xs text-gray-500">189 posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#monsoon-tips</span>
                    <span className="text-xs text-gray-500">156 posts</span>
                  </div>
                </div>
              </div>

              {/* Active Farmers */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Active Farmers</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👨‍🌾</span>
                    <div>
                      <p className="font-medium text-sm">Suresh Patel</p>
                      <p className="text-xs text-gray-500">Online now</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👩‍🌾</span>
                    <div>
                      <p className="font-medium text-sm">Meera Singh</p>
                      <p className="text-xs text-gray-500">2 min ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'experts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">{expert.avatar}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{expert.name}</h3>
                    <p className="text-gray-600">{expert.specialty}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm">{expert.rating}</span>
                      <span className="text-sm text-gray-500">({expert.consultations} consultations)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    expert.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {expert.available ? 'Available' : 'Busy'}
                  </div>
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium ${
                      expert.available 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!expert.available}
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;

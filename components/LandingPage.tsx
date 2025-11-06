import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInUp">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Direct Market Access for 
                <span className="gradient-text"> Farmers</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect directly with buyers, eliminate middlemen, and get fair prices for your produce through our real-time auction platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/auth" 
                  className="btn-primary text-center"
                >
                  Get Started Today
                </Link>
                <button className="btn-secondary">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="animate-slideInRight">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop" 
                  alt="Farmers in field" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-gray-800">Live Auctions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Agri-Link?</h2>
            <p className="text-xl text-gray-600">Empowering farmers with technology and direct market access</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Auctions</h3>
              <p className="text-gray-600">Bid on fresh produce in real-time and get the best prices for your crops.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Connection</h3>
              <p className="text-gray-600">Connect directly with buyers and eliminate middleman commissions.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile First</h3>
              <p className="text-gray-600">Access the platform anywhere, anytime with our mobile-optimized design.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-100">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Verified Buyers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">₹50L+</div>
              <div className="text-green-100">Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-green-100">Higher Prices</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Farming Business?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of farmers who are already earning better prices through direct market access.</p>
          <Link 
            to="/auth" 
            className="btn-primary text-lg px-8 py-4"
          >
            Start Selling Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

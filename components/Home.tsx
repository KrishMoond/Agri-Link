import React from 'react';
import Carousel from './Carousel';
import AuctionCarousel from './AuctionCarousel';
import '.././src/css/home.css'

const Home: React.FC = () => {
  return(
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex flex-col w-full">
      {/* Hero Section with Carousel */}
      <div className="w-full px-4 py-6 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <Carousel/>
          </div>
        </div>
      </div>
      
      {/* Live Auctions Section */}
      <div className="w-full flex flex-col items-center px-4 pb-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600 uppercase tracking-wider">Live Now</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="font-bold text-4xl md:text-5xl text-center mb-4 tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Active Auctions
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              <div className="w-4 h-1 bg-green-300 rounded-full"></div>
              <div className="w-2 h-1 bg-green-200 rounded-full"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Discover fresh produce and agricultural products from local farmers. 
              Bid now and get the best deals directly from the source.
            </p>
          </div>
          
          {/* Auctions Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">Live Bidding</span>
                </div>
                <span className="text-green-100 text-sm">Updated in real-time</span>
              </div>
            </div>
            <AuctionCarousel />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home;

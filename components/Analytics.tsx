import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../src/configs/firebase';
import { auctionService } from '../src/services/auctionService';

const Analytics: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);
  const [timeRange, setTimeRange] = useState('30d');
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    averagePrice: 0,
    successRate: 0
  });

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const auctions = await auctionService.getAuctionsBySeller(user?.uid || user?._id);
      
      // Group by product and calculate totals
      const productMap = new Map();
      let totalRevenue = 0;
      let totalQuantity = 0;
      let successfulAuctions = 0;
      
      auctions.forEach(auction => {
        const finalPrice = auction.topBids?.[0]?.bidAmount || auction.pricePerUnit;
        const revenue = finalPrice * auction.quantity;
        totalRevenue += revenue;
        totalQuantity += auction.quantity;
        
        if (auction.topBids && auction.topBids.length > 0) {
          successfulAuctions++;
        }
        
        if (productMap.has(auction.itemName)) {
          const existing = productMap.get(auction.itemName);
          productMap.set(auction.itemName, {
            ...existing,
            quantity: existing.quantity + auction.quantity,
            revenue: existing.revenue + revenue
          });
        } else {
          productMap.set(auction.itemName, {
            name: auction.itemName,
            quantity: auction.quantity,
            revenue: revenue,
            avgPrice: finalPrice
          });
        }
      });
      
      setTopProducts(Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue));
      setMetrics({
        totalRevenue,
        averagePrice: totalRevenue / totalQuantity || 0,
        successRate: auctions.length > 0 ? (successfulAuctions / auctions.length) * 100 : 0
      });
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your farm business performance</p>
            </div>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">₹{metrics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              <span className="text-green-600">↗ +12.5%</span>
              <span className="text-gray-500 ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Price</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">₹{Math.round(metrics.averagePrice)}/kg</div>
            <div className="flex items-center text-sm">
              <span className="text-red-600">↘ -3.2%</span>
              <span className="text-gray-500 ml-2">vs market avg</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">{metrics.successRate.toFixed(1)}%</div>
            <div className="flex items-center text-sm">
              <span className="text-green-600">↗ +2.1%</span>
              <span className="text-gray-500 ml-2">auction wins</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
            <div className="h-64 flex items-end space-x-2">
              {salesData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                    style={{ height: `${(data.sales / 70000) * 200}px` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌾</span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.quantity} kg sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹{product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">₹{Math.round(product.avgPrice)}/kg</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No sales data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900">Price Prediction</h4>
                <p className="text-sm text-blue-800">Tomato prices expected to rise 15% next week due to monsoon delays</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900">Best Time to Sell</h4>
                <p className="text-sm text-green-800">Optimal selling window for onions: Next 3-5 days</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-900">Demand Forecast</h4>
                <p className="text-sm text-yellow-800">High demand expected for leafy vegetables in your region</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900">Quality Tip</h4>
                <p className="text-sm text-purple-800">Consider organic certification to increase prices by 20-30%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

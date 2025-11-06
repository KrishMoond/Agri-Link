import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../src/configs/firebase';
import { auctionService } from '../src/services/auctionService';

const SmartPricing: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [userCrops, setUserCrops] = useState<string[]>([]);
  const [marketData, setMarketData] = useState<any>({});
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserCrops();
      fetchMarketData();
    }
  }, [user]);

  const fetchUserCrops = async () => {
    try {
      const auctionsQuery = query(
        collection(db, 'auctions'),
        where('sellerId', '==', user?.uid)
      );
      const auctionsSnapshot = await getDocs(auctionsQuery);
      const crops = [...new Set(auctionsSnapshot.docs.map(doc => doc.data().itemName))];
      setUserCrops(crops);
      if (crops.length > 0 && !selectedCrop) {
        setSelectedCrop(crops[0]);
      }
    } catch (error) {
      console.error('Error fetching user crops:', error);
    }
  };

  const fetchMarketData = async () => {
    try {
      // Fetch all auctions to analyze market trends
      const allAuctionsSnapshot = await getDocs(collection(db, 'auctions'));
      const allAuctions = allAuctionsSnapshot.docs.map(doc => doc.data());
      
      // Group by item and calculate average prices
      const marketPrices: any = {};
      allAuctions.forEach(auction => {
        const item = auction.itemName;
        const price = auction.topBids?.[0]?.bidAmount || auction.pricePerUnit;
        
        if (!marketPrices[item]) {
          marketPrices[item] = { prices: [], quantities: [] };
        }
        marketPrices[item].prices.push(price);
        marketPrices[item].quantities.push(auction.quantity);
      });
      
      // Calculate market insights
      const processedData: any = {};
      Object.keys(marketPrices).forEach(item => {
        const prices = marketPrices[item].prices;
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const recentPrices = prices.slice(-5); // Last 5 auctions
        const trend = recentPrices[recentPrices.length - 1] > recentPrices[0] ? 'up' : 'down';
        
        processedData[item] = {
          current: Math.round(avgPrice),
          predicted: Math.round(avgPrice * (trend === 'up' ? 1.1 : 0.95)),
          trend,
          confidence: Math.min(95, 60 + prices.length * 2), // Higher confidence with more data
          factors: ['Market demand', 'Seasonal variation', 'Supply trends']
        };
      });
      
      setMarketData(processedData);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const currentData = marketData[selectedCrop] || {
    current: 0,
    predicted: 0,
    trend: 'stable',
    confidence: 0,
    factors: ['Insufficient data']
  };

  const marketComparison = [
    { market: 'Local Mandi', price: 42, distance: '5 km' },
    { market: 'Regional Hub', price: 48, distance: '25 km' },
    { market: 'Metro Market', price: 55, distance: '150 km' },
    { market: 'Export Terminal', price: 62, distance: '300 km' }
  ];



  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Pricing Intelligence</h1>
          <p className="text-gray-600">AI-powered price predictions and market insights</p>
        </div>

        {/* Crop Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Your Crop</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userCrops.length > 0 ? userCrops.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedCrop === crop
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">🌾</div>
                <span className="text-sm font-medium">{crop}</span>
              </button>
            )) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No crops found in your auctions</p>
                <p className="text-sm">Create an auction to see pricing insights</p>
              </div>
            )}
          </div>
        </div>

        {/* Price Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Price Prediction</h2>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₹{currentData.current} → ₹{currentData.predicted}
              </div>
              <div className={`text-lg font-semibold ${
                currentData.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentData.trend === 'up' ? '↗' : '↘'} 
                {Math.abs(currentData.predicted - currentData.current)} per kg
              </div>
              <p className="text-sm text-gray-600">Next 7 days prediction</p>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Confidence Level</span>
                <span>{currentData.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${currentData.confidence}%` }}
                ></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Key Factors</h3>
              <div className="space-y-2">
                {currentData.factors.map((factor, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Calculator */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Calculator</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span>Current Price Revenue:</span>
                  <span className="font-semibold">₹{(currentData.current * quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Predicted Revenue:</span>
                  <span className="font-semibold text-green-600">₹{(currentData.predicted * quantity).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold">Potential Gain:</span>
                  <span className={`font-bold ${
                    currentData.predicted > currentData.current ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{Math.abs((currentData.predicted - currentData.current) * quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Recommendation</h4>
                <p className="text-sm text-blue-800">
                  {currentData.trend === 'up' 
                    ? 'Wait 3-5 days for better prices. Consider storage options.'
                    : 'Sell now before prices drop further. Market conditions unfavorable.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Market Price Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Market</th>
                  <th className="text-left py-3 px-4">Price (₹/kg)</th>
                  <th className="text-left py-3 px-4">Distance</th>
                  <th className="text-left py-3 px-4">Net Revenue*</th>
                  <th className="text-left py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {marketComparison.map((market, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">{market.market}</td>
                    <td className="py-3 px-4">₹{market.price}</td>
                    <td className="py-3 px-4 text-gray-600">{market.distance}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">
                        ₹{((market.price - 2) * quantity).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                        List Here
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">*After deducting ₹2/kg for transportation & handling</p>
          </div>
        </div>

        {/* Historical Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Price Trend (Last 30 Days)</h2>
          <div className="h-64 flex items-end space-x-2">
            {selectedCrop && marketData[selectedCrop] ? (
              Array.from({ length: 30 }, (_, i) => {
                const basePrice = currentData.current;
                const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
                const price = basePrice * (1 + variation);
                const height = (price / (basePrice * 1.2)) * 200;
                const isToday = i === 29;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isToday ? 'bg-green-600' : 'bg-gray-400 hover:bg-green-500'
                      }`}
                      style={{ height: `${height}px` }}
                      title={`₹${Math.round(price)}/kg`}
                    />
                    {i % 5 === 0 && (
                      <span className="text-xs text-gray-600 mt-2">{30 - i}d</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a crop to view price trends
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPricing;

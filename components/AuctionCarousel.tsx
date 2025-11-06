import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from './auction/Card'
import { auctionService } from '../src/services/auctionService';
import Loader from './shared/loader';

interface Auction {
  id: string;
  auctionEndDate: string;
  auctionStartDate: string;
  imageUrl: string;
  itemName: string;
  location: string;
  pricePerUnit: number;
  quantity: number;
  sellerEmail: string;
  sellerName: string | null;
  unit: string;
  auctionId: string;
}

const AuctionCarousel = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionList = await auctionService.getActiveAuctions();
        setAuctions(auctionList.slice(0, 6));
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-80 loading-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏷️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Auctions</h3>
          <p className="text-gray-600 mb-6">There are currently no active auctions available. Check back later or create your own auction.</p>
          <Link 
            to="/add" 
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Create Auction</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {auctions.map((auction, index) => (
          <div 
            key={auction.id} 
            className="animate-fadeIn card-hover"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Card auction={auction} searchLocation={""} />
          </div>
        ))}
      </div>
      
      {/* View All Button */}
      <div className="text-center">
        <Link 
          to="/auctions" 
          className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          <span>View All Auctions</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default AuctionCarousel;

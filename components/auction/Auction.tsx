import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../src/configs/auth";
import { auctionService } from "../../src/services/auctionService";
import { userService } from "../../src/services/userService";
import Card from "./Card";
import Loader from "../shared/loader";
import search from "../../src/assets/shared/search.svg";
import cross from "../../src/assets/shared/cross.svg";
import { useNavigate } from "react-router-dom";

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

const AuctionPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null); // State to store user role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionList = await auctionService.getActiveAuctions();
        setAuctions(auctionList);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const userData = await userService.getUserProfile();
          if (userData) {
            setUserRole(userData.role || null);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchAuctions();
    fetchUserRole();
  }, []);

  const filteredAuctions = auctions.filter((auction) => {
    const searchLower = searchTerm.toLowerCase();
    const locationLower = auction.location.toLowerCase();
    const itemNameLower = auction.itemName.toLowerCase();

    return (
      locationLower.includes(searchLower) || itemNameLower.includes(searchLower)
    );
  });

  const handleAdd = () => {
    navigate('/add');
  };

  if (loading) {
    return <Loader/>;

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Auctions</h1>
            <p className="text-gray-600">Discover fresh produce from local farmers</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location or item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 shadow-sm"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <img src={search} alt="search" className="w-5 h-5 opacity-60" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Stats & Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredAuctions.length}</span> active auctions
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live bidding</span>
              </div>
            </div>
            
            {userRole !== "buyer" && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Auction</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {filteredAuctions.map((auction, index) => (
              <div 
                key={auction.id} 
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card auction={auction} searchLocation={searchTerm} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm ? 'No auctions found' : 'No active auctions'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No auctions match "${searchTerm}". Try a different search term.`
                  : 'There are currently no active auctions. Check back later or create your own auction.'
                }
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn-secondary"
                >
                  Clear Search
                </button>
              ) : userRole !== "buyer" && (
                <button
                  onClick={handleAdd}
                  className="btn-primary"
                >
                  Create First Auction
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionPage;

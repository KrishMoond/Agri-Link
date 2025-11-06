import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import locationimg from "../../src/assets/shared/location.svg";

interface AuctionCardProps {
  auction: {
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    auctionEndDate: string;
    imageUrl: string;
    auctionId: string;
    location: string;
    unit: string;
  };
  searchLocation: string; 
}

const Card: React.FC<AuctionCardProps> = ({ auction, searchLocation }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.auctionEndDate).getTime();
      const distance = endTime - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
          setIsUrgent(hours < 6);
        } else {
          setTimeLeft(`${minutes}m`);
          setIsUrgent(true);
        }
      } else {
        setTimeLeft('Ended');
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [auction.auctionEndDate]);

  const highlightLocation = (location: string, searchTerm: string) => {
    if (!searchTerm) return location;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = location.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col min-w-[280px] max-w-sm hover:-translate-y-1"
      onClick={() => navigate("/bid", { state: { auction } })}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}
        <img
          src={auction.imageUrl}
          alt={auction.itemName}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full font-medium shadow-sm">
            #{auction.auctionId}
          </span>
          <div className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="font-medium">Live</span>
          </div>
        </div>
        
        {/* Timer Badge */}
        <div className="absolute top-3 right-3">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            isUrgent ? 'bg-red-500/90 text-white animate-pulse' : 'bg-white/90 text-gray-800'
          }`}>
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
          {auction.itemName}
        </h3>
        
        {/* Price & Quantity */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-green-600">₹{auction.pricePerUnit.toLocaleString()}</span>
          <span className="text-sm text-gray-500">/{auction.unit || "unit"}</span>
          <div className="ml-auto text-right">
            <div className="text-xs text-gray-500">Available</div>
            <div className="text-sm font-semibold text-gray-800">{auction.quantity} {auction.unit}</div>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <img src={locationimg} alt="Location" className="w-4 h-4 opacity-60" />
          <span className="truncate">{highlightLocation(auction.location, searchLocation)}</span>
        </div>
        
        {/* Action Button */}
        <div className="mt-auto">
          <div className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 px-4 rounded-xl font-semibold text-center transition-all duration-300 group-hover:from-green-600 group-hover:to-green-700 group-hover:shadow-lg">
            Place Bid
          </div>
        </div>
      </div>
      
      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-200 rounded-2xl transition-colors duration-300 pointer-events-none" />
    </div>
  );
};

export default Card;

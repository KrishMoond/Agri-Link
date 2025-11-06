import React from "react";
import { Link, useLocation } from "react-router-dom";
import auctionicon from "../src/assets/bottomnav/auction.svg";
import homeicon from "../src/assets/bottomnav/home.svg";
import profileicon from "../src/assets/bottomnav/profile.svg";

const BottomNav: React.FC = () => {
  const location = useLocation();
  const hiddenRoutes = ["/auth"];
  const shouldShowBottomNav = !hiddenRoutes.includes(location.pathname);

  if (!shouldShowBottomNav) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/home", icon: homeicon, label: "Home" },
    { path: "/dashboard", icon: auctionicon, label: "Dashboard" },
    { path: "/auctions", icon: auctionicon, label: "Auctions" },
    { path: "/profile", icon: profileicon, label: "Profile" }
  ];

  return (
    <div className="sm:block md:hidden">
      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl px-2 py-2">
          <div className="flex items-center justify-center space-x-1">
            {navItems.map(({ path, icon, label }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-300 group ${
                    active
                      ? "text-white bg-gradient-to-br from-green-500 to-green-600 shadow-lg scale-105"
                      : "text-gray-600 hover:text-green-500 hover:bg-green-50 active:scale-95"
                  }`}
                >
                  {/* Background Glow for Active */}
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-xl blur-sm opacity-50 -z-10 scale-110" />
                  )}
                  
                  <div className={`relative transition-all duration-300 ${
                    active ? "scale-110 -translate-y-0.5" : "scale-100 group-hover:scale-110"
                  }`}>
                    <img 
                      src={icon} 
                      alt={label.toLowerCase()} 
                      className={`w-6 h-6 transition-all duration-300 ${
                        active ? "filter brightness-0 invert" : "group-hover:scale-110"
                      }`} 
                    />
                    
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse shadow-sm" />
                    )}
                    
                    {/* Hover Effect */}
                    {!active && (
                      <div className="absolute inset-0 bg-green-500/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300" />
                    )}
                  </div>
                  
                  <span className={`text-xs mt-1 font-medium transition-all duration-300 ${
                    active ? "text-white font-semibold" : "text-gray-500 group-hover:text-green-600"
                  }`}>
                    {label}
                  </span>
                  
                  {/* Bottom Indicator */}
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Shadow underneath */}
        <div className="absolute inset-0 bg-black/10 rounded-2xl blur-xl scale-95 -z-20" />
      </div>
      
      {/* Safe area for content */}
      <div className="h-20" />
    </div>
  );
};

export default BottomNav;

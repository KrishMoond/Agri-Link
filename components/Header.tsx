import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser } from "../src/configs/auth";

const Header: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [location]);
  
  const isActive = (path: string) => {
    return location.pathname === path || (path === "/home" && location.pathname === "/");
  };

  const publicNavItems = [
    { path: "/", label: "Home" },
    { path: "/auth", label: "Sign In" }
  ];

  const getNavItemsByRole = (userRole: string) => {
    switch (userRole) {
      case 'farmer':
        return [
          { path: "/dashboard", label: "Dashboard" },
          { path: "/add", label: "List Produce" },
          { path: "/myauctions", label: "My Products" },
          { path: "/pricing", label: "Market Prices" },
          { path: "/analytics", label: "Sales Analytics" }
        ];
      case 'buyer':
        return [
          { path: "/dashboard", label: "Dashboard" },
          { path: "/auctions", label: "Browse Products" },
          { path: "/bid", label: "My Purchases" },
          { path: "/pricing", label: "Price Tracker" }
        ];
      case 'retailer':
        return [
          { path: "/dashboard", label: "Dashboard" },
          { path: "/auctions", label: "Bulk Purchase" },
          { path: "/bid", label: "Orders" },
          { path: "/analytics", label: "Purchase Analytics" }
        ];
      case 'expert':
        return [
          { path: "/dashboard", label: "Dashboard" },
          { path: "/community", label: "Advisory" },
          { path: "/quality", label: "Quality Guide" },
          { path: "/analytics", label: "Market Trends" }
        ];
      case 'admin':
        return [
          { path: "/admin/dashboard", label: "Admin Panel" },
          { path: "/analytics", label: "Platform Analytics" },
          { path: "/quality", label: "Verification" }
        ];
      default:
        return [
          { path: "/dashboard", label: "Dashboard" }
        ];
    }
  };

  const navItems = user ? getNavItemsByRole(user.role) : publicNavItems;

  return (
    <header className="lg:px-16 px-4 bg-white/95 backdrop-blur-md flex flex-wrap items-center py-4 shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="flex-1 flex justify-between items-center">
        <Link to={user ? "/home" : "/"} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-lg">🌾</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Agri-Link
            </h1>
            <p className="text-xs text-gray-500 -mt-1">Direct Market Access</p>
          </div>
        </Link>
      </div>

      <div className="hidden md:flex flex-grow justify-end">
        <nav>
          <ul className="flex items-center space-x-2">
            {navItems.map(({ path, label }) => {
              const active = isActive(path);
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
                      active
                        ? "text-green-600 bg-green-50 shadow-sm"
                        : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <span className="relative z-10">{label}</span>
                    {active && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </li>
              );
            })}

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

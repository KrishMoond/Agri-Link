import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../src/configs/auth';

const BottomNavRole: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [location]);

  const getBottomNavByRole = (userRole: string) => {
    switch (userRole) {
      case 'farmer':
        return [
          { path: '/dashboard', icon: '🏠', label: 'Home' },
          { path: '/add', icon: '🌾', label: 'List' },
          { path: '/myauctions', icon: '📋', label: 'Products' },
          { path: '/pricing', icon: '💰', label: 'Prices' },
          { path: '/profile', icon: '👤', label: 'Profile' }
        ];
      case 'buyer':
        return [
          { path: '/dashboard', icon: '🏠', label: 'Home' },
          { path: '/auctions', icon: '🛒', label: 'Browse' },
          { path: '/bid', icon: '📦', label: 'Orders' },
          { path: '/pricing', icon: '📈', label: 'Prices' },
          { path: '/profile', icon: '👤', label: 'Profile' }
        ];
      case 'retailer':
        return [
          { path: '/dashboard', icon: '🏠', label: 'Home' },
          { path: '/auctions', icon: '🏪', label: 'Market' },
          { path: '/bid', icon: '📦', label: 'Orders' },
          { path: '/analytics', icon: '📊', label: 'Analytics' },
          { path: '/profile', icon: '👤', label: 'Profile' }
        ];
      case 'expert':
        return [
          { path: '/dashboard', icon: '🏠', label: 'Home' },
          { path: '/community', icon: '👨🏫', label: 'Advisory' },
          { path: '/quality', icon: '✅', label: 'Quality' },
          { path: '/analytics', icon: '📊', label: 'Trends' },
          { path: '/profile', icon: '👤', label: 'Profile' }
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: '⚙️', label: 'Admin' },
          { path: '/analytics', icon: '📊', label: 'Analytics' },
          { path: '/quality', icon: '🛡️', label: 'Verify' },
          { path: '/profile', icon: '👤', label: 'Profile' }
        ];
      default:
        return [
          { path: '/home', icon: '🏠', label: 'Home' },
          { path: '/auth', icon: '🔐', label: 'Login' }
        ];
    }
  };

  if (!user) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
        <div className="flex justify-around">
          <Link to="/home" className="flex flex-col items-center py-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xs text-gray-600">Home</span>
          </Link>
          <Link to="/auth" className="flex flex-col items-center py-2">
            <span className="text-2xl">🔐</span>
            <span className="text-xs text-gray-600">Login</span>
          </Link>
        </div>
      </div>
    );
  }

  const navItems = getBottomNavByRole(user.role);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
      <div className="flex justify-around">
        {navItems.map(({ path, icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavRole;
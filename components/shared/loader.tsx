import React from 'react';
import './loader.css';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = true 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Main spinner */}
        <div className={`${sizeClasses[size]} border-4 border-green-100 border-t-green-500 rounded-full animate-spin`} />
        
        {/* Inner spinner */}
        <div className={`absolute inset-2 ${sizeClasses[size === 'lg' ? 'md' : 'sm']} border-2 border-green-200 border-b-green-400 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>
      
      {text && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 font-medium animate-pulse">{text}</p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;

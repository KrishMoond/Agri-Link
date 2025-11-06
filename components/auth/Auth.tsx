import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Logo Section */}
      <div className="text-center mb-8 animate-fadeIn">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white text-2xl font-bold">🌾</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
          Welcome to Agri-Link
        </h1>
        <p className="text-gray-600">Direct Market Access for Farmers</p>
      </div>

      {/* Auth Container */}
      <div className={`w-full animate-scaleIn ${isLogin ? 'max-w-md' : 'max-w-4xl'}`}>
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex bg-gradient-to-r from-gray-50 to-green-50">
            <button
              className={`flex-1 py-6 px-8 text-xl font-bold transition-all duration-300 relative ${
                isLogin
                  ? "text-green-600 bg-white shadow-lg"
                  : "text-gray-500 hover:text-green-500 hover:bg-white/50"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
              {isLogin && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600" />
              )}
            </button>
            <button
              className={`flex-1 py-6 px-8 text-xl font-bold transition-all duration-300 relative ${
                !isLogin
                  ? "text-green-600 bg-white shadow-lg"
                  : "text-gray-500 hover:text-green-500 hover:bg-white/50"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Create Account
              {!isLogin && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600" />
              )}
            </button>
          </div>

          {/* Form Container */}
          <div className="p-8 md:p-12">
            <div className="transition-all duration-500">
              {isLogin ? <Login /> : <Signup />}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../src/services/authService";
import usePasswordToggle from "../../src/hooks/usePasswordToggle";
import { useNotification } from "../../src/hooks/useNotification";
import Notification from "../../src/components/Notification";
import visibleicon from "../../src/assets/auth/visible.svg";
import hiddenicon from "../../src/assets/auth/hidden.svg";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { type, toggleVisibility, visible } = usePasswordToggle();
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authService.login({ email, password });
      showSuccess("Welcome Back!", "You have successfully logged in to your account.");
      setTimeout(() => navigate("/home"), 1500);
    } catch (error: any) {
      console.error("Error logging in: ", error);
      const message = error.response?.data?.message || "Login failed. Please try again.";
      showError("Login Failed", message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      showWarning("Email Required", "Please enter your email address first to reset your password.");
      return;
    }
    showWarning("Feature Coming Soon", "Password reset functionality will be available soon.");
  };

  return (
    <>
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={type}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img src={visible ? visibleicon : hiddenicon} alt="Toggle" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Sign In
        </button>
      </form>
      </div>
    </>
  );
};

export default Login;

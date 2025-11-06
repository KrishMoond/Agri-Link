import React from "react";
import { authService } from "../../src/services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    authService.logout();
    toast.success("You have logged out!");
    navigate("/auth");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold">Welcome to the Home Page</h1>
      <p className="mt-4 text-gray-700">
        Only authenticated users can access this page.
      </p>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;

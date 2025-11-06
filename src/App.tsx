import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../components/auth/Auth";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AddItem from "../components/auction/AddItem";
import Auction from "../components/auction/Auction";
import Header from '../components/Header';
import Weather from '../components/Weather';
import MyAuctions from '../components/auction/MyAuctions';
import "./index.css";
import ContactUs from "../components/ContactUs";
import Home from "../components/Home";
import Profile from "./pages/Profile";
import BottomNavRole from "../components/BottomNavRole";
import Bid from "../components/auction/bid";
import LandingPage from "../components/LandingPage";
import Dashboard from "../components/Dashboard";
import Analytics from "../components/Analytics";
import QualityAssurance from "../components/QualityAssurance";
import Community from "../components/Community";
import SmartPricing from "../components/SmartPricing";
import AdminAuth from "../components/admin/AdminAuth";
import AdminDashboard from "../components/admin/AdminDashboard";
import ProtectedAdminRoute from "../components/admin/ProtectedAdminRoute";

const App: React.FC = () => {
  return (
    <Router future={{ 
      v7_startTransition: true, 
      v7_relativeSplatPath: true 
    }}>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/weather" element={<ProtectedRoute><Weather/></ProtectedRoute>} />
        <Route path="/bid" element={<ProtectedRoute><Bid/></ProtectedRoute>} />
        <Route path="/myauctions" element={<ProtectedRoute><MyAuctions/></ProtectedRoute>} />
        <Route path="/auctions" element={<ProtectedRoute><Auction/></ProtectedRoute>} />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          }
        />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/quality" element={<ProtectedRoute><QualityAssurance /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/pricing" element={<ProtectedRoute><SmartPricing /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminAuth />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      </Routes>
      <BottomNavRole />
    </Router>
  );
};

export default App;

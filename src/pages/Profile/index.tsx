import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../configs/auth";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import Loader from "../../../components/shared/loader";
interface UserData {
  dob: string;
  email: string;
  farmerCardNumber: string;
  gender: string;
  gstNumber: string | null;
  location: string[];
  name: string;
  phone: string;
  profilePicUrl: string;
  role: string;
  uid: string;
}

function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        try {
          const profile = await userService.getUserProfile();
          if (profile) {
            setUserData(profile as UserData);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          navigate("/auth");
        }
      } else {
        navigate("/auth");
      }
    };
    loadProfile();
  }, [navigate]);

  if (!userData) {
    return <Loader/>;
  }

  const handleLogout = () => {
    authService.logout();
    toast.success("You have logged out!");
    navigate("/auth");
  };
  const handleNav = () => {
    navigate('/myauctions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-white relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <img
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
                  src={userData.profilePicUrl}
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {userData.role}
                  </span>
                  <span className="bg-green-400/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    Verified
                  </span>
                </div>
                <p className="text-green-100 text-lg">{userData.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Phone</span>
                <span className="text-gray-900 font-semibold">{userData.phone}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Date of Birth</span>
                <span className="text-gray-900 font-semibold">{userData.dob}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Gender</span>
                <span className="text-gray-900 font-semibold capitalize">{userData.gender}</span>
              </div>
              <div className="flex items-start justify-between py-3">
                <span className="text-gray-600 font-medium">Location</span>
                <div className="text-right">
                  {userData.location.map((loc, index) => (
                    <div key={index} className="text-gray-900 font-semibold">{loc}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🏢</span>
              </div>
              Business Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Role</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {userData.role}
                </span>
              </div>
              {userData.farmerCardNumber && (
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Farmer Card</span>
                  <span className="text-gray-900 font-semibold font-mono">{userData.farmerCardNumber}</span>
                </div>
              )}
              {userData.gstNumber && (
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">GST Number</span>
                  <span className="text-gray-900 font-semibold font-mono">{userData.gstNumber}</span>
                </div>
              )}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mt-4">
                <div className="text-sm text-gray-600 mb-1">Member Since</div>
                <div className="text-lg font-bold text-gray-900">2024</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleNav}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg">🏷️</span>
              <span>My Auctions</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-lg">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

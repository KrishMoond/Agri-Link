import React, { useState, useEffect } from "react";
import { authService } from "../../src/services/authService";
import usePasswordToggle from "../../src/hooks/usePasswordToggle";
import visibleicon from "../../src/assets/auth/visible.svg";
import hiddenicon from "../../src/assets/auth/hidden.svg";
import { useNotification } from "../../src/hooks/useNotification";
import Notification from "../../src/components/Notification";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/loader";


const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [role, setRole] = useState<string>("buyer");
  const [gstNumber, setGstNumber] = useState<string>("");
  const [farmerCardNumber, setFarmerCardNumber] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // New state for loading
  const { type, toggleVisibility, visible } = usePasswordToggle();
  const navigate = useNavigate();
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();

  useEffect(() => {
    const fetchLocationData = async () => {
      if (pin.length === 6) {
        setLoading(true); // Set loading to true before starting fetch
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
          const data = await response.json();

          if (data[0].Status === "Success") {
            const locationData = data[0].PostOffice[0];
            setCity(locationData.District);
            setState(locationData.State);
            setAddress(locationData.Division);
          } else {
            showError("Invalid PIN Code", "Please enter a valid 6-digit PIN code.");
          }
        } catch (error) {
          showWarning("Location Service", "Unable to fetch location data. Please enter manually.");
        } finally {
          setLoading(false); // Set loading to false after fetch completes
        }
      }
    };

    fetchLocationData();
  }, [pin]);

 

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when signup starts

    // Required fields for everyone
    const requiredFields = [
      email,
      password,
      name,
      phone,
      city,
      pin,
      address,
      state,
      gender,
      dob,
    ];

    // Check for empty fields
    const hasEmptyFields = requiredFields.some((field) => field.trim() === "");

    // GST Number and Farmer Card Number should be required based on role
    if ((role === "buyer" || role === "retailer") && gstNumber.trim() === "") {
      showError("GST Number Required", "Please provide your GST Number to register as a buyer/retailer.");
      setLoading(false);
      return;
    }

    if (role === "farmer" && farmerCardNumber.trim() === "") {
      showError("Farmer Card Required", "Please provide your Farmer Card Number to register as a farmer.");
      setLoading(false);
      return;
    }

    // If any required field is empty, show error
    if (hasEmptyFields) {
      showError("Incomplete Information", "Please fill in all required fields to complete registration.");
      setLoading(false);
      return;
    }

    // Continue with the signup process if no fields are empty
    try {
      await authService.register({
        name,
        email,
        password,
        phone,
        location: [state, city, address, pin],
        gender,
        dob,
        role: role as 'buyer' | 'farmer' | 'retailer' | 'expert',
        gstNumber: (role === "buyer" || role === "retailer") ? gstNumber : undefined,
        farmerCardNumber: role === "farmer" ? farmerCardNumber : undefined
      });

      // Reset form fields
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setCity("");
      setPin("");
      setAddress("");
      setState("");
      setGender("");
      setDob("");
      setRole("buyer");
      setGstNumber("");
      setFarmerCardNumber("");
      setProfilePic(null);
      setProfilePicPreview("");

      showSuccess("Account Created!", "Your account has been created successfully. Welcome to Agri-Link!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (error: any) {
      console.error("Error signing up: ", error);
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      showError("Registration Failed", message);
    } finally {
      setLoading(false); // Set loading to false after process ends
    }
  };

  // Function to handle profile picture change and preview
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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
      <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen p-4">
          <div>
            <div>
              <Loader />
              <span className="visually-hidden"></span>
            </div>
          </div>
        </div>
      ) : (
<form onSubmit={handleSignup} className="w-full max-w-2xl space-y-6">
  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
      <input
        type="text"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        required
      />
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
      <div className="relative">
        <input
          type={type}
          placeholder="Create a password"
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

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        required
      />
    </div>
  </div>

  <div className="grid md:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
      <input
        type="text"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        maxLength={6}
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
      <input
        type="text"
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        required
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
    <input
      type="text"
      placeholder="Enter your address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
      required
    />
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        required
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="non-binary">Non-binary</option>
        <option value="prefer-not-to-say">Prefer not to say</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        required
      />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        role === 'buyer' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        <input
          type="radio"
          name="role"
          value="buyer"
          checked={role === 'buyer'}
          onChange={(e) => setRole(e.target.value)}
          className="sr-only"
        />
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
            role === 'buyer' ? 'border-green-500 bg-green-500' : 'border-gray-300'
          }`}>
            {role === 'buyer' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />}
          </div>
          <div>
            <div className="font-medium text-gray-900">Buyer</div>
            <div className="text-sm text-gray-500">Purchase products</div>
          </div>
        </div>
      </label>
      <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        role === 'farmer' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        <input
          type="radio"
          name="role"
          value="farmer"
          checked={role === 'farmer'}
          onChange={(e) => setRole(e.target.value)}
          className="sr-only"
        />
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
            role === 'farmer' ? 'border-green-500 bg-green-500' : 'border-gray-300'
          }`}>
            {role === 'farmer' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />}
          </div>
          <div>
            <div className="font-medium text-gray-900">Farmer</div>
            <div className="text-sm text-gray-500">Sell your produce</div>
          </div>
        </div>
      </label>
      <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        role === 'retailer' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        <input
          type="radio"
          name="role"
          value="retailer"
          checked={role === 'retailer'}
          onChange={(e) => setRole(e.target.value)}
          className="sr-only"
        />
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
            role === 'retailer' ? 'border-green-500 bg-green-500' : 'border-gray-300'
          }`}>
            {role === 'retailer' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />}
          </div>
          <div>
            <div className="font-medium text-gray-900">Retailer</div>
            <div className="text-sm text-gray-500">Bulk purchasing</div>
          </div>
        </div>
      </label>
      <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        role === 'expert' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        <input
          type="radio"
          name="role"
          value="expert"
          checked={role === 'expert'}
          onChange={(e) => setRole(e.target.value)}
          className="sr-only"
        />
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
            role === 'expert' ? 'border-green-500 bg-green-500' : 'border-gray-300'
          }`}>
            {role === 'expert' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />}
          </div>
          <div>
            <div className="font-medium text-gray-900">Expert</div>
            <div className="text-sm text-gray-500">Provide consultation</div>
          </div>
        </div>
      </label>
    </div>
  </div>

  {(role === "buyer" || role === "retailer") && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
      <input
        type="text"
        placeholder="Enter GST number"
        value={gstNumber}
        onChange={(e) => setGstNumber(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        required
      />
    </div>
  )}

  {role === "farmer" && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Farmer Card Number</label>
      <input
        type="text"
        placeholder="Enter farmer card number"
        value={farmerCardNumber}
        onChange={(e) => setFarmerCardNumber(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
        required
      />
    </div>
  )}

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        {profilePicPreview ? (
          <img src={profilePicPreview} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border-4 border-gray-200" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">📷</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
      </div>
    </div>
  </div>

  <button
    type="submit"
    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
  >
    Create Account
  </button>
</form>

      )}
      </div>
    </>
  );
};

export default Signup;

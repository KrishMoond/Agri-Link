import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String },
    pincode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['farmer', 'buyer', 'retailer', 'admin', 'expert'], 
    required: true 
  },
  
  // Farmer-specific fields
  farmerDetails: {
    farmerCardNumber: { type: String },
    farmSize: { type: Number }, // in acres
    farmingExperience: { type: Number }, // in years
    specializations: [{ type: String }], // crops they specialize in
    organicCertified: { type: Boolean, default: false },
    bankDetails: {
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
      accountHolderName: { type: String }
    }
  },
  
  // Business details
  businessDetails: {
    gstNumber: { type: String },
    businessName: { type: String },
    businessType: { 
      type: String, 
      enum: ['individual', 'partnership', 'company', 'cooperative'] 
    },
    businessAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String }
    }
  },
  
  profilePicUrl: { type: String, default: '' },
  
  verification: {
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isDocumentVerified: { type: Boolean, default: false },
    verificationLevel: { 
      type: String, 
      enum: ['unverified', 'basic', 'verified', 'premium'],
      default: 'unverified'
    },
    documents: [{
      type: { type: String }, // aadhar, pan, farmer-card, etc.
      url: { type: String },
      status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  
  preferences: {
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'INR' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    deliveryRadius: { type: Number, default: 50 } // in km
  },
  
  ratings: {
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    ratingsBreakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  
  statistics: {
    totalTransactions: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    successfulDeliveries: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now }
  },
  
  isActive: { type: Boolean, default: true },
  isSuspended: { type: Boolean, default: false },
  suspensionReason: { type: String }
}, { timestamps: true });

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ 'location.state': 1, 'location.district': 1 });
userSchema.index({ role: 1, isActive: 1 });

export default mongoose.model('User', userSchema);
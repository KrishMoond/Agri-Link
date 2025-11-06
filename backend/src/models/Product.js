import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'organic', 'other']
  },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { 
    type: String, 
    required: true,
    enum: ['kg', 'quintal', 'ton', 'piece', 'dozen', 'liter']
  },
  pricePerUnit: { type: Number, required: true },
  minimumOrder: { type: Number, default: 1 },
  quality: {
    type: String,
    enum: ['premium', 'standard', 'organic', 'export-quality'],
    default: 'standard'
  },
  harvestDate: { type: Date },
  expiryDate: { type: Date },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName: { type: String, required: true },
  farmerEmail: { type: String, required: true },
  farmerPhone: { type: String, required: true },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String },
    pincode: { type: String }
  },
  images: [{ type: String }],
  availability: { 
    type: String, 
    enum: ['available', 'sold-out', 'reserved'],
    default: 'available'
  },
  certifications: [{
    type: { type: String }, // organic, fair-trade, etc.
    authority: { type: String },
    certificateNumber: { type: String },
    validUntil: { type: Date }
  }],
  ratings: [{
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ location: 1, category: 1, availability: 1 });

export default mongoose.model('Product', productSchema);
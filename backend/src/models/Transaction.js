import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['direct-purchase', 'auction-win', 'bulk-order'],
    required: true 
  },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
  
  orderDetails: {
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true }
    }
  },

  payment: {
    method: { 
      type: String, 
      enum: ['upi', 'bank-transfer', 'cod', 'escrow'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentId: { type: String },
    paidAt: { type: Date },
    escrowReleased: { type: Boolean, default: false }
  },

  delivery: {
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    estimatedDate: { type: Date },
    actualDate: { type: Date },
    trackingId: { type: String },
    deliveryPartner: { type: String }
  },

  communication: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['message', 'status-update', 'system'] }
  }],

  dispute: {
    isDisputed: { type: Boolean, default: false },
    reason: { type: String },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    raisedAt: { type: Date },
    status: { 
      type: String, 
      enum: ['open', 'investigating', 'resolved', 'closed'],
      default: 'open'
    },
    resolution: { type: String }
  },

  feedback: {
    buyerRating: { type: Number, min: 1, max: 5 },
    buyerReview: { type: String },
    sellerRating: { type: Number, min: 1, max: 5 },
    sellerReview: { type: String }
  },

  invoice: {
    invoiceNumber: { type: String },
    gstAmount: { type: Number, default: 0 },
    finalAmount: { type: Number }
  }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
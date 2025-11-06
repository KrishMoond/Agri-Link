import mongoose from 'mongoose';

const topBidSchema = new mongoose.Schema({
  bidAmount: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  location: { type: String },
  phone: { type: String }
}, { timestamps: true });

const auctionSchema = new mongoose.Schema({
  auctionId: { type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  auctionStartDate: { type: String, required: true },
  auctionEndDate: { type: String, required: true },
  sellerName: { type: String, required: true },
  sellerEmail: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  topBids: [topBidSchema]
}, { timestamps: true });

export default mongoose.model('Auction', auctionSchema);
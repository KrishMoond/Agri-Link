import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'document', 'price-quote', 'order-update'],
    default: 'text'
  },
  attachments: [{ 
    type: { type: String },
    url: { type: String },
    name: { type: String }
  }],
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  participants: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['buyer', 'seller'] },
    joinedAt: { type: Date, default: Date.now }
  }],
  
  relatedTo: {
    type: { type: String, enum: ['product', 'auction', 'transaction'] },
    referenceId: { type: mongoose.Schema.Types.ObjectId }
  },

  messages: [messageSchema],
  
  lastMessage: {
    content: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date }
  },

  isActive: { type: Boolean, default: true },
  
  negotiation: {
    isNegotiating: { type: Boolean, default: false },
    currentOffer: {
      amount: { type: Number },
      quantity: { type: Number },
      proposedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'accepted', 'rejected', 'counter'] }
    },
    history: [{
      amount: { type: Number },
      quantity: { type: Number },
      proposedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String },
      timestamp: { type: Date, default: Date.now }
    }]
  }
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
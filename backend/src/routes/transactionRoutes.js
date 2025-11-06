import express from 'express';
import Transaction from '../models/Transaction.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create new transaction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      type, sellerId, productId, auctionId, orderDetails, paymentMethod
    } = req.body;

    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5);

    const transaction = new Transaction({
      transactionId,
      type,
      buyerId: req.user.userId,
      sellerId,
      productId,
      auctionId,
      orderDetails,
      payment: {
        method: paymentMethod,
        status: 'pending'
      }
    });

    await transaction.save();

    // Update product availability if it's a direct purchase
    if (type === 'direct-purchase' && productId) {
      await Product.findByIdAndUpdate(productId, {
        $inc: { quantity: -orderDetails.quantity }
      });
    }

    res.status(201).json({ 
      message: 'Transaction created successfully', 
      transaction,
      transactionId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
});

// Get user transactions
router.get('/my-transactions', authenticateToken, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    
    const filter = {
      $or: [
        { buyerId: req.user.userId },
        { sellerId: req.user.userId }
      ]
    };

    if (type) filter.type = type;
    if (status) filter['delivery.status'] = status;

    const transactions = await Transaction.find(filter)
      .populate('buyerId', 'name phone location')
      .populate('sellerId', 'name phone location')
      .populate('productId', 'name category images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// Get transaction by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('buyerId', 'name phone location businessDetails')
      .populate('sellerId', 'name phone location farmerDetails')
      .populate('productId', 'name category images');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is part of this transaction
    if (transaction.buyerId._id.toString() !== req.user.userId && 
        transaction.sellerId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to view this transaction' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
});

// Update transaction status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { deliveryStatus, paymentStatus, trackingId } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Only seller can update delivery status, only buyer can confirm payment
    if (deliveryStatus && transaction.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only seller can update delivery status' });
    }

    const updates = {};
    if (deliveryStatus) {
      updates['delivery.status'] = deliveryStatus;
      if (trackingId) updates['delivery.trackingId'] = trackingId;
      if (deliveryStatus === 'delivered') {
        updates['delivery.actualDate'] = new Date();
      }
    }
    if (paymentStatus) {
      updates['payment.status'] = paymentStatus;
      if (paymentStatus === 'completed') {
        updates['payment.paidAt'] = new Date();
      }
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json({ message: 'Transaction updated successfully', transaction: updatedTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
});

// Add communication message
router.post('/:id/message', authenticateToken, async (req, res) => {
  try {
    const { message, type = 'message' } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is part of this transaction
    if (transaction.buyerId.toString() !== req.user.userId && 
        transaction.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    transaction.communication.push({
      senderId: req.user.userId,
      message,
      type
    });

    await transaction.save();
    res.json({ message: 'Message added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding message', error: error.message });
  }
});

// Raise dispute
router.post('/:id/dispute', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is part of this transaction
    if (transaction.buyerId.toString() !== req.user.userId && 
        transaction.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (transaction.dispute.isDisputed) {
      return res.status(400).json({ message: 'Dispute already raised for this transaction' });
    }

    transaction.dispute = {
      isDisputed: true,
      reason,
      raisedBy: req.user.userId,
      raisedAt: new Date(),
      status: 'open'
    };

    await transaction.save();
    res.json({ message: 'Dispute raised successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error raising dispute', error: error.message });
  }
});

// Add feedback
router.post('/:id/feedback', authenticateToken, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user is part of this transaction
    if (transaction.buyerId.toString() !== req.user.userId && 
        transaction.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if transaction is completed
    if (transaction.delivery.status !== 'delivered') {
      return res.status(400).json({ message: 'Can only add feedback after delivery' });
    }

    if (transaction.buyerId.toString() === req.user.userId) {
      transaction.feedback.buyerRating = rating;
      transaction.feedback.buyerReview = review;
    } else {
      transaction.feedback.sellerRating = rating;
      transaction.feedback.sellerReview = review;
    }

    await transaction.save();

    // Update user ratings
    const targetUserId = transaction.buyerId.toString() === req.user.userId 
      ? transaction.sellerId 
      : transaction.buyerId;
    
    const user = await User.findById(targetUserId);
    if (user) {
      user.ratings.totalRatings += 1;
      user.ratings.ratingsBreakdown[rating] += 1;
      
      // Recalculate average rating
      const totalPoints = Object.entries(user.ratings.ratingsBreakdown)
        .reduce((sum, [stars, count]) => sum + (parseInt(stars) * count), 0);
      user.ratings.averageRating = totalPoints / user.ratings.totalRatings;
      
      await user.save();
    }

    res.json({ message: 'Feedback added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding feedback', error: error.message });
  }
});

// Get transaction analytics (for admin)
router.get('/analytics/overview', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalTransactions = await Transaction.countDocuments();
    const completedTransactions = await Transaction.countDocuments({ 'delivery.status': 'delivered' });
    const pendingTransactions = await Transaction.countDocuments({ 'delivery.status': 'pending' });
    const disputedTransactions = await Transaction.countDocuments({ 'dispute.isDisputed': true });

    // Revenue calculation
    const revenueData = await Transaction.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$orderDetails.totalAmount' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      disputedTransactions,
      totalRevenue,
      completionRate: totalTransactions > 0 ? (completedTransactions / totalTransactions * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

export default router;
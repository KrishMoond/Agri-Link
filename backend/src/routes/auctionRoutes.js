import express from 'express';
import Auction from '../models/Auction.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create auction
router.post('/', authenticateToken, async (req, res) => {
  try {
    const auctionData = {
      ...req.body,
      sellerId: req.user._id,
      sellerName: req.user.name,
      sellerEmail: req.user.email
    };
    const auction = new Auction(auctionData);
    await auction.save();
    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active auctions
router.get('/active', async (req, res) => {
  try {
    const auctions = await Auction.find({
      auctionEndDate: { $gt: new Date().toISOString() }
    }).sort({ auctionEndDate: 1 });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get auctions by seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const auctions = await Auction.find({ sellerId: req.params.sellerId });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Place bid
router.post('/:id/bid', authenticateToken, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    const bid = {
      ...req.body,
      userId: req.user._id,
      userName: req.user.name,
      location: req.user.location[0],
      phone: req.user.phone
    };

    auction.topBids.push(bid);
    auction.topBids.sort((a, b) => b.bidAmount - a.bidAmount);
    auction.topBids = auction.topBids.slice(0, 5);

    await auction.save();
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete auction
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Auction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Auction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
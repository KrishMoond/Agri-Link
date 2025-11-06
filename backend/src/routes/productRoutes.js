import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create new product
router.post('/', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name, category, description, quantity, unit, pricePerUnit,
      minimumOrder, quality, harvestDate, expiryDate, location
    } = req.body;

    const productId = 'PROD' + Date.now() + Math.random().toString(36).substr(2, 5);
    
    const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];

    const product = new Product({
      productId,
      name,
      category,
      description,
      quantity: Number(quantity),
      unit,
      pricePerUnit: Number(pricePerUnit),
      minimumOrder: Number(minimumOrder) || 1,
      quality,
      harvestDate: harvestDate ? new Date(harvestDate) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      farmerId: req.user.userId,
      farmerName: req.user.name,
      farmerEmail: req.user.email,
      farmerPhone: req.user.phone,
      location: JSON.parse(location),
      images
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const {
      category, location, minPrice, maxPrice, quality, 
      search, page = 1, limit = 20, sortBy = 'createdAt'
    } = req.query;

    const filter = { isActive: true, availability: 'available' };
    
    if (category) filter.category = category;
    if (quality) filter.quality = quality;
    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = Number(maxPrice);
    }
    if (location) {
      filter.$or = [
        { 'location.state': new RegExp(location, 'i') },
        { 'location.district': new RegExp(location, 'i') }
      ];
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Product.find(filter)
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('farmerId', 'name ratings.averageRating verification.verificationLevel');

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmerId', 'name phone location ratings verification businessDetails');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Update product
router.put('/:id', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.farmerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      updates.images = [...product.images, ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.farmerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Get farmer's products
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const products = await Product.find({ 
      farmerId: req.params.farmerId, 
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farmer products', error: error.message });
  }
});

// Add product rating
router.post('/:id/rating', authenticateToken, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already rated this product
    const existingRating = product.ratings.find(r => r.buyerId.toString() === req.user.userId);
    
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this product' });
    }

    product.ratings.push({
      buyerId: req.user.userId,
      rating: Number(rating),
      review
    });

    // Calculate new average rating
    const totalRatings = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = sumRatings / totalRatings;

    await product.save();
    res.json({ message: 'Rating added successfully', averageRating: product.averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Error adding rating', error: error.message });
  }
});

export default router;
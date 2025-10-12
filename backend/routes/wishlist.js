import express from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { Product } from '../models/Product.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Get all wishlist items for the authenticated user
router.get('/', async (req, res) => {
  try {
    let wishlistItems = await Wishlist.findAll({
      where: { userId: req.user.id },
      order: [['dateAdded', 'DESC']]
    });

    // Expand product details if requested
    if (req.query.expand === 'product') {
      wishlistItems = await Promise.all(wishlistItems.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          ...item.toJSON(),
          product
        };
      }));
    }

    res.json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add item to wishlist
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    // Check if item already exists in user's wishlist
    const existingItem = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });
    if (existingItem) {
      return res.status(409).json({ error: 'Product already in wishlist' });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId: req.user.id,
      productId,
      dateAdded: new Date()
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });
    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    await wishlistItem.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// Check if product is in wishlist
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });
    res.json({ inWishlist: !!wishlistItem });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    res.status(500).json({ error: 'Failed to check wishlist' });
  }
});

export default router;

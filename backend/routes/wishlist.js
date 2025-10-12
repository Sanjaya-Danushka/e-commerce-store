import express from 'express';
import { Wishlist } from '../models/Wishlist.js';
import { Product } from '../models/Product.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware only for GET requests (to view wishlist)
// POST, DELETE can work without authentication for guest users
router.get('/', authenticateUser, async (req, res) => {
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
    const authHeader = req.headers.authorization;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    // If user is authenticated, save to database
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const jwt = (await import('jsonwebtoken')).default;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

      // Check if item already exists in user's wishlist
      const existingItem = await Wishlist.findOne({
        where: {
          userId: decoded.id,
          productId
        }
      });
      if (existingItem) {
        return res.status(409).json({ error: 'Product already in wishlist' });
      }

      // Add to wishlist
      const wishlistItem = await Wishlist.create({
        userId: decoded.id,
        productId,
        dateAdded: new Date()
      });

      return res.status(201).json(wishlistItem);
    } else {
      // For guest users, return success but don't save to database
      // The frontend will handle localStorage storage
      return res.status(201).json({
        productId,
        dateAdded: new Date(),
        guest: true,
        message: 'Item added to guest wishlist'
      });
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/:productId', authenticateUser, async (req, res) => {
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
router.get('/:productId', authenticateUser, async (req, res) => {
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

import express from 'express';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware only for GET requests (to view cart)
// POST, PUT, DELETE can work without authentication for guest users
router.get('/', authenticateUser, async (req, res) => {
  try {
    const expand = req.query.expand;
    let cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'ASC']]
    });

    if (expand === 'product') {
      cartItems = await Promise.all(cartItems.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          ...item.toJSON(),
          product
        };
      }));
    }

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const authHeader = req.headers.authorization;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found' });
    }

    if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
      return res.status(400).json({ error: 'Quantity must be a number between 1 and 10' });
    }

    // If user is authenticated, save to database
    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 7) {
      const token = authHeader.substring(7);
      const jwt = (await import('jsonwebtoken')).default;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

      // Check if item already exists in user's cart
      let cartItem = await CartItem.findOne({
        where: {
          userId: decoded.id,
          productId
        }
      });

      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        cartItem = await CartItem.create({
          userId: decoded.id,
          productId,
          quantity,
          deliveryOptionId: "1"
        });
      }

      return res.status(201).json(cartItem);
    } else {
      // For guest users, return success but don't save to database
      // The frontend will handle localStorage storage
      return res.status(201).json({
        productId,
        quantity,
        guest: true,
        message: 'Item added to guest cart'
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.put('/:productId', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, deliveryOptionId } = req.body;

    const cartItem = await CartItem.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity !== undefined) {
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ error: 'Quantity must be a non-negative number' });
      }
      cartItem.quantity = quantity;
    }

    if (deliveryOptionId !== undefined) {
      cartItem.deliveryOptionId = deliveryOptionId;
    }

    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

router.delete('/:productId', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;

    const cartItem = await CartItem.findOne({
      where: {
        userId: req.user.id,
        productId
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

export default router;

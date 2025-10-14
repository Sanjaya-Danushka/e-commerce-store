import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { DeliveryOption } from '../models/DeliveryOption.js';
import { CartItem } from '../models/CartItem.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Helper function to get user ID from JWT token
const getUserIdFromToken = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded.id;
  } catch (error) {
    return null;
  }
};

router.get('/', async (req, res) => {
  const expand = req.query.expand;
  const userId = getUserIdFromToken(req);

  // If no user is authenticated, return empty array (orders are private)
  if (!userId) {
    return res.json([]);
  }

  let orders = await Order.unscoped().findAll({
    where: { userId },
    order: [['orderTimeMs', 'DESC']] // Sort by most recent
  });

  if (expand === 'products') {
    orders = await Promise.all(orders.map(async (order) => {
      const products = await Promise.all(order.products.map(async (product) => {
        const productDetails = await Product.findByPk(product.productId);
        return {
          ...product,
          product: productDetails
        };
      }));
      return {
        ...order.toJSON(),
        products
      };
    }));
  }

  res.json(orders);
});

router.post('/', async (req, res) => {
  const userId = getUserIdFromToken(req);

  // Use cart items from request body if provided, otherwise get all from database
  let cartItems;
  if (req.body.cartItems && req.body.cartItems.length > 0) {
    // Convert the frontend cart items to match the database model structure
    cartItems = req.body.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId
    }));
  } else {
    cartItems = await CartItem.findAll();
  }

  if (cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  let totalCostCents = 0;
  const products = await Promise.all(cartItems.map(async (item) => {
    const product = await Product.findByPk(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    const deliveryOption = await DeliveryOption.findByPk(item.deliveryOptionId);
    if (!deliveryOption) {
      throw new Error(`Invalid delivery option: ${item.deliveryOptionId}`);
    }
    const productCost = product.priceCents * item.quantity;
    const shippingCost = deliveryOption.priceCents;
    totalCostCents += productCost + shippingCost;
    const estimatedDeliveryTimeMs = Date.now() + deliveryOption.deliveryDays * 24 * 60 * 60 * 1000;
    return {
      productId: item.productId,
      quantity: item.quantity,
      estimatedDeliveryTimeMs
    };
  }));

  totalCostCents = Math.round(totalCostCents * 1.1);

  const order = await Order.create({
    userId,
    orderTimeMs: Date.now(),
    totalCostCents,
    products
  });

  // Only clear cart items if we're processing all items from database
  if (!req.body.cartItems) {
    await CartItem.destroy({ where: {} });
  } else {
    // Remove only the specific cart items that were ordered
    const orderedProductIds = cartItems.map(item => item.productId);
    await CartItem.destroy({
      where: {
        productId: orderedProductIds
      }
    });
  }

  res.status(201).json(order);
});

router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const expand = req.query.expand;

  let order = await Order.findByPk(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (expand === 'products') {
    const products = await Promise.all(order.products.map(async (product) => {
      const productDetails = await Product.findByPk(product.productId);
      return {
        ...product,
        product: productDetails
      };
    }));
    order = {
      ...order.toJSON(),
      products
    };
  }

  res.json(order);
});

export default router;

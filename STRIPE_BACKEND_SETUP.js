/* eslint-disable no-undef */
// BACKEND ENDPOINT FOR STRIPE PAYMENT INTENT
// Add this to your backend server (e.g., in Node.js/Express)

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Your secret key from .env

// Create Payment Intent endpoint
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, paymentMethodId, metadata } = req.body;

    // Validate required fields
    if (!amount || !currency || !paymentMethodId) {
      return res.status(400).json({
        error: 'Missing required fields: amount, currency, paymentMethodId'
      });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      payment_method: paymentMethodId,
      confirm: true, // Confirm immediately
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: metadata || {},
      return_url: `${req.protocol}://${req.get('host')}/checkout`, // For 3D Secure
    });

    // Return the client secret and payment intent ID
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      details: error.message
    });
  }
});

module.exports = router;

// =============================================================================
// ENVIRONMENT VARIABLES SETUP
// =============================================================================

/*
1. Create a .env file in your backend project root:

STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

2. Install required packages:
npm install stripe dotenv cors express

3. Use environment variables in your server:
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
*/

// =============================================================================
// FRONTEND INTEGRATION NOTES
// =============================================================================

/*
1. The frontend is already configured with your publishable key
2. Test card 4242424242424242 will work for testing
3. For production, use your live keys instead of test keys
4. Handle webhooks for payment confirmations on your backend
5. Consider adding order confirmation emails
6. Implement proper error handling for declined cards
*/

// =============================================================================
// ADDITIONAL BACKEND ENDPOINTS NEEDED
// =============================================================================

/*
// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update order status in database
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // Handle failed payment
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Order creation endpoint (already exists in your backend)
router.post('/orders', async (req, res) => {
  try {
    const { cartItems, paymentMethod, paymentTransactionId, paymentStatus } = req.body;

    // Create order in database
    const order = await Order.create({
      items: cartItems,
      paymentMethod,
      paymentTransactionId,
      paymentStatus,
      total: calculateOrderTotal(cartItems), // Implement this function
      status: 'confirmed'
    });

    res.json({ orderId: order.id, success: true });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});
*/

export default {}; // This file is for documentation purposes

import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key_here');

// Create payment intent endpoint
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', paymentMethodId, metadata } = req.body;

    // Validate required fields
    if (!amount || !paymentMethodId) {
      return res.status(400).json({
        error: 'Amount and paymentMethodId are required',
        success: false
      });
    }

    console.log('Creating payment intent for amount:', amount, 'currency:', currency);

    // Create payment intent using Stripe SDK
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents (ensure it's an integer)
      currency: currency,
      payment_method: paymentMethodId,
      confirm: true,
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      }
    });

    console.log('Payment intent created:', paymentIntent.id, 'Status:', paymentIntent.status);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      requiresAction: paymentIntent.status === 'requires_action',
      success: true
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);

    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        error: error.message,
        success: false,
        type: 'card_error'
      });
    }

    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        error: error.message,
        success: false,
        type: 'invalid_request'
      });
    }

    res.status(500).json({
      error: error.message || 'Payment processing failed',
      success: false,
      type: 'server_error'
    });
  }
});

// Webhook endpoint for Stripe (optional but recommended)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Update order status in database
      break;
    }
    case 'payment_intent.payment_failed': {
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export default router;

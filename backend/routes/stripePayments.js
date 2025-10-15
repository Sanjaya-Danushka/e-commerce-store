/* eslint-disable no-undef */
import express from 'express';
import Stripe from 'stripe';
import paypal from 'paypal-rest-sdk';

const router = express.Router();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key_here');

// Configure PayPal
paypal.configure({
  mode: 'sandbox', // sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
  headers: {
    'PayPal-Request-Id': `shopease-${Date.now()}`
  }
});

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

// PayPal payment endpoint
router.post('/create-paypal-payment', async (req, res) => {
  try {
    const { amount, currency = 'USD', description, returnUrl, cancelUrl } = req.body;

    // Validate required fields
    if (!amount || !description) {
      return res.status(400).json({
        error: 'Amount and description are required',
        success: false
      });
    }

    console.log('Creating PayPal payment for amount:', amount, 'currency:', currency);

    // Create PayPal payment
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: returnUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success`,
        cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/cancel`
      },
      transactions: [{
        item_list: {
          items: [{
            name: description,
            sku: 'shopease-order',
            price: amount,
            currency: currency,
            quantity: 1
          }]
        },
        amount: {
          currency: currency,
          total: amount
        },
        description: description
      }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error('PayPal payment creation error:', error);
        return res.status(500).json({
          error: error.message || 'PayPal payment creation failed',
          success: false,
          type: 'paypal_error'
        });
      }

      console.log('PayPal payment created:', payment.id);

      // Find approval URL
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url');

      res.json({
        paymentId: payment.id,
        approvalUrl: approvalUrl ? approvalUrl.href : null,
        success: true
      });
    });

  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    res.status(500).json({
      error: error.message || 'PayPal payment processing failed',
      success: false,
      type: 'server_error'
    });
  }
});

// PayPal payment execution endpoint
router.post('/execute-paypal-payment', async (req, res) => {
  try {
    const { paymentId, payerId } = req.body;

    if (!paymentId || !payerId) {
      return res.status(400).json({
        error: 'PaymentId and PayerId are required',
        success: false
      });
    }

    console.log('Executing PayPal payment:', paymentId);

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [{
        amount: {
          currency: 'USD',
          total: '0' // This should be set from the original payment
        }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) {
        console.error('PayPal payment execution error:', error);
        return res.status(500).json({
          error: error.message || 'PayPal payment execution failed',
          success: false,
          type: 'paypal_error'
        });
      }

      console.log('PayPal payment executed successfully:', payment.id, 'State:', payment.state);

      res.json({
        paymentId: payment.id,
        state: payment.state,
        success: true
      });
    });

  } catch (error) {
    console.error('Error executing PayPal payment:', error);
    res.status(500).json({
      error: error.message || 'PayPal payment execution failed',
      success: false,
      type: 'server_error'
    });
  }
});

export default router;

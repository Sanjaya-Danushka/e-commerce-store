/* eslint-env node */
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create transporter for email sending
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // eslint-disable-line no-undef
    port: process.env.SMTP_PORT || 587, // eslint-disable-line no-undef
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports // eslint-disable-line no-undef
    auth: {
      user: process.env.SMTP_USER, // eslint-disable-line no-undef
      pass: process.env.SMTP_PASS, // eslint-disable-line no-undef
    },
  });
};

// POST /api/subscribe - Handle newsletter subscription
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address'
      });
    }

    // Check if email is configured properly (only check for actual credentials now)
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) { // eslint-disable-line no-undef
      console.log('❌ EMAIL CONFIGURATION MISSING:', {
        timestamp: new Date().toISOString(),
        message: 'SMTP credentials not configured in .env file'
      });

      return res.status(500).json({
        error: 'Email service not configured. Please contact administrator.'
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Email options for admin notification
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER, // eslint-disable-line no-undef
      to: 'dsanjaya712@gmail.com', // Admin email
      subject: 'New Newsletter Subscription - ShopEase',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Newsletter Subscription</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            A new user has subscribed to the ShopEase newsletter. You can manage subscribers through the admin panel.
          </p>
        </div>
      `,
    };

    // Send notification email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to subscriber
    const confirmationMailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER, // eslint-disable-line no-undef
      to: email,
      subject: 'Welcome to ShopEase Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to ShopEase!</h2>
          <p>Thank you for subscribing to our newsletter. You'll be the first to know about:</p>
          <ul style="color: #666; margin: 20px 0;">
            <li>Exclusive deals and discounts</li>
            <li>New product launches</li>
            <li>Seasonal sales and promotions</li>
            <li>Fashion tips and trends</li>
          </ul>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>Your subscription details:</strong></p>
            <p style="margin: 5px 0; color: #666;">Email: ${email}</p>
            <p style="margin: 5px 0; color: #666;">Date: ${new Date().toLocaleString()}</p>
          </div>
          <p>If you have any questions, feel free to contact us at support@shopease.com</p>
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The ShopEase Team
          </p>
        </div>
      `,
    };

    // Send confirmation email (don't fail the whole request if this fails)
    try {
      await transporter.sendMail(confirmationMailOptions);
    } catch (confirmationError) {
      console.warn('Failed to send confirmation email:', confirmationError.message);
      // Continue - this shouldn't fail the main request
    }

    res.status(200).json({
      message: 'Successfully subscribed to newsletter! Welcome to ShopEase!'
    });

  } catch (error) {
    console.error('Error processing subscription:', error);

    // Handle specific nodemailer errors
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        error: 'Email authentication failed. Please check email configuration.'
      });
    }

    if (error.code === 'ECONNECTION') {
      return res.status(500).json({
        error: 'Unable to connect to email server. Please check email configuration.'
      });
    }

    // Log more details for debugging
    console.error('Full error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    res.status(500).json({
      error: 'Failed to process subscription. Please try again later.'
    });
  }
});

export default router;

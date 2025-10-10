/* eslint-env node */
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create transporter for email sending
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST, // eslint-disable-line no-undef
    port: process.env.SMTP_PORT || 587, // eslint-disable-line no-undef
    auth: {
      user: process.env.SMTP_USER || '', // eslint-disable-line no-undef
      pass: process.env.SMTP_PASS || '', // eslint-disable-line no-undef
    },
  });
};

// POST /api/contact/chat-request - Handle chat request submissions
router.post('/chat-request', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      preferredTime,
      message
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        error: 'Name, email, and phone are required'
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
      console.log('💬 CHAT REQUEST RECEIVED (TEST MODE):', {
        name,
        email,
        phone,
        preferredTime,
        message,
        timestamp: new Date().toISOString(),
        note: 'Email configuration not set up - logging instead of sending email'
      });

      // For development/testing - just log the request and return success
      return res.status(200).json({
        message: 'Chat request received successfully! (Email configuration needed for notifications)',
        note: 'Configure SMTP settings in .env file to enable actual email notifications'
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Email options for admin notification
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER, // eslint-disable-line no-undef
      to: 'dsanjaya712@gmail.com', // Admin email
      subject: `New Chat/Callback Request - ${name} - ShopEase`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Chat/Callback Request Received</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Customer Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
            ${preferredTime ? `<p style="margin: 10px 0;"><strong>Preferred Time:</strong> ${preferredTime}</p>` : ''}
            ${message ? `<p style="margin: 10px 0;"><strong>Message:</strong></p><div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 5px;">${message.replace(/\n/g, '<br>')}</div>` : ''}
          </div>
          <p style="color: #666; font-size: 14px;">
            A customer has requested assistance. Please respond within 2 hours during business hours.
          </p>
        </div>
      `,
    };

    // Send notification email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to customer
    const confirmationMailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER, // eslint-disable-line no-undef
      to: email,
      subject: `Chat Request Received - ShopEase Support`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Contacting ShopEase Support!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to our customer support team! We've received your request and will get back to you shortly.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Request Summary:</h3>
            <p><strong>Request Type:</strong> ${preferredTime === 'callback' ? 'Callback Request' : 'Live Chat Request'}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            ${preferredTime ? `<p><strong>Preferred Time:</strong> ${preferredTime}</p>` : ''}
          </div>

          <p>What happens next:</p>
          <ul style="color: #666; margin: 20px 0;">
            <li>Our support team has been notified of your request</li>
            <li>For immediate assistance, try our live chat during business hours</li>
            <li>For callback requests, we'll call you within 2 hours during business hours</li>
            <li>You can also reach us at support@shopease.com or +1 (555) 123-4567</li>
          </ul>

          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The ShopEase Support Team
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
      message: 'Chat request submitted successfully! Our team will contact you shortly.'
    });

  } catch (error) {
    console.error('Error processing chat request:', error);

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

    res.status(500).json({
      error: 'Failed to process chat request. Please try again later.'
    });
  }
});

export default router;

/* eslint-env node */
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create transporter for email sending
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // eslint-disable-line no-undef
    port: process.env.SMTP_PORT || 587, // eslint-disable-line no-undef
    auth: {
      user: process.env.SMTP_USER || '', // eslint-disable-line no-undef
      pass: process.env.SMTP_PASS || '', // eslint-disable-line no-undef
    },
  });
};

// POST /api/affiliate/apply - Handle affiliate applications
router.post('/apply', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      website,
      socialMedia,
      audienceSize,
      primaryPlatform,
      experience,
      motivation,
      applicationType,
      tierApplied
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !website) {
      return res.status(400).json({
        error: 'Name, email, phone, and website are required'
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
      console.log('🤝 AFFILIATE APPLICATION RECEIVED (TEST MODE):', {
        name,
        email,
        phone,
        website,
        tierApplied,
        applicationType,
        timestamp: new Date().toISOString(),
        message: 'Email configuration not set up - logging instead of sending email'
      });

      // For development/testing - just log the application and return success
      return res.status(200).json({
        message: 'Application received successfully! (Email configuration needed for notifications)',
        note: 'Configure SMTP settings in .env file to enable actual email notifications'
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Email options for admin notification
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER, // eslint-disable-line no-undef
      to: 'dsanjaya712@gmail.com', // Admin email
      subject: `New Affiliate Application - ${tierApplied} - ShopEase`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Affiliate Application Received</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Application Type:</strong> ${applicationType === 'tier' ? 'Tier Application' : 'General Application'}</p>
            <p style="margin: 10px 0;"><strong>Tier Applied:</strong> ${tierApplied}</p>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 10px 0;"><strong>Website:</strong> ${website}</p>
            ${socialMedia ? `<p style="margin: 10px 0;"><strong>Social Media:</strong> ${socialMedia}</p>` : ''}
            ${audienceSize ? `<p style="margin: 10px 0;"><strong>Audience Size:</strong> ${audienceSize}</p>` : ''}
            ${primaryPlatform ? `<p style="margin: 10px 0;"><strong>Primary Platform:</strong> ${primaryPlatform}</p>` : ''}
            ${experience ? `<p style="margin: 10px 0;"><strong>Experience:</strong></p><div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 5px;">${experience.replace(/\n/g, '<br>')}</div>` : ''}
            ${motivation ? `<p style="margin: 10px 0;"><strong>Motivation:</strong></p><div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 5px;">${motivation.replace(/\n/g, '<br>')}</div>` : ''}
          </div>
          <p style="color: #666; font-size: 14px;">
            A new affiliate application has been submitted. Please review the applicant's information and respond within 48 hours.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to applicant
    const confirmationMailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER, // eslint-disable-line no-undef
      to: email,
      subject: `Affiliate Application Received - ${tierApplied} - ShopEase`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Your Affiliate Application!</h2>
          <p>Thank you for your interest in joining the ShopEase affiliate program! We've received your application for the ${tierApplied}.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Application Summary:</h3>
            <p><strong>Tier Applied:</strong> ${tierApplied}</p>
            <p><strong>Website:</strong> ${website}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Next Steps:</strong> We'll review your application within 48 hours</p>
          </div>

          <p>What happens next:</p>
          <ul style="color: #666; margin: 20px 0;">
            <li>Our affiliate team will review your application</li>
            <li>We'll verify your platform and audience details</li>
            <li>Once approved, you'll receive your unique affiliate links</li>
            <li>Start earning commissions immediately upon approval</li>
          </ul>

          <p>If you have any questions, please don't hesitate to contact us at affiliates@shopease.com</p>

          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The ShopEase Affiliate Team
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
      message: 'Application submitted successfully! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Error processing affiliate application:', error);

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
      error: 'Failed to process application. Please try again later.'
    });
  }
});

export default router;

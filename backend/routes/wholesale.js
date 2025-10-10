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

// POST /api/wholesale/apply - Handle wholesale applications
router.post('/apply', async (req, res) => {
  try {
    const {
      businessName,
      contactName,
      email,
      phone,
      businessType,
      annualRevenue,
      website,
      address,
      taxId,
      businessDescription,
      monthlyVolume,
      applicationType,
      tierApplied,
      categoryInterest
    } = req.body;

    // Validate required fields
    if (!businessName || !contactName || !email || !phone) {
      return res.status(400).json({
        error: 'Business name, contact name, email, and phone are required'
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
      console.log('🏪 WHOLESALE APPLICATION RECEIVED (TEST MODE):', {
        businessName,
        contactName,
        email,
        phone,
        tierApplied,
        monthlyVolume,
        categoryInterest,
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
      subject: `New Wholesale Application - ${tierApplied} - ShopEase`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Wholesale Application Received</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Application Type:</strong> ${applicationType === 'apply' ? 'Tier Application' : applicationType === 'contact' ? 'Contact Inquiry' : 'General Application'}</p>
            <p style="margin: 10px 0;"><strong>Tier Applied:</strong> ${tierApplied}</p>
            ${categoryInterest ? `<p style="margin: 10px 0;"><strong>Category Interest:</strong> ${categoryInterest}</p>` : ''}
            <p style="margin: 10px 0;"><strong>Business Name:</strong> ${businessName}</p>
            <p style="margin: 10px 0;"><strong>Contact Name:</strong> ${contactName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
            ${businessType ? `<p style="margin: 10px 0;"><strong>Business Type:</strong> ${businessType}</p>` : ''}
            ${annualRevenue ? `<p style="margin: 10px 0;"><strong>Annual Revenue:</strong> ${annualRevenue}</p>` : ''}
            ${website ? `<p style="margin: 10px 0;"><strong>Website:</strong> ${website}</p>` : ''}
            ${address ? `<p style="margin: 10px 0;"><strong>Address:</strong> ${address}</p>` : ''}
            ${taxId ? `<p style="margin: 10px 0;"><strong>Tax ID:</strong> ${taxId}</p>` : ''}
            ${monthlyVolume ? `<p style="margin: 10px 0;"><strong>Expected Monthly Volume:</strong> ${monthlyVolume}</p>` : ''}
            ${businessDescription ? `<p style="margin: 10px 0;"><strong>Business Description:</strong></p><div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 5px;">${businessDescription.replace(/\n/g, '<br>')}</div>` : ''}
          </div>
          <p style="color: #666; font-size: 14px;">
            A new wholesale application has been submitted. Please review the business information and respond within 2-3 business days.
          </p>
        </div>
      `,
    };

    // Send notification email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to applicant
    const confirmationMailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER, // eslint-disable-line no-undef
      to: email,
      subject: `Wholesale Application Received - ${tierApplied} - ShopEase`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Your Wholesale Application!</h2>
          <p>Dear ${contactName},</p>
          <p>Thank you for your interest in the ShopEase wholesale program! We've received your application for the ${tierApplied}.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Application Summary:</h3>
            <p><strong>Business:</strong> ${businessName}</p>
            <p><strong>Tier Applied:</strong> ${tierApplied}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Next Steps:</strong> We'll review your application within 2-3 business days</p>
          </div>

          <p>What happens next:</p>
          <ul style="color: #666; margin: 20px 0;">
            <li>Our wholesale team will review your business information</li>
            <li>We'll verify your business credentials and requirements</li>
            <li>Once approved, you'll receive wholesale pricing and B2B access</li>
            <li>Start ordering with volume discounts immediately</li>
          </ul>

          <p>If you have any questions, please don't hesitate to contact us at wholesale@shopease.com</p>

          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The ShopEase Wholesale Team
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
    console.error('Error processing wholesale application:', error);

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

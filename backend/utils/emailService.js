import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import process from 'process';

// Load environment variables
config();

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Generate verification code
export const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send verification email
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    // For development/demo purposes, just log the verification code
    console.log(`=== VERIFICATION CODE FOR ${email} ===`);
    console.log(`Code: ${verificationCode}`);
    console.log(`Expires: ${new Date(Date.now() + 10 * 60 * 1000)}`);
    console.log('=====================================');

    // In production, you would send actual email here
    // const mailOptions = {
    //   from: process.env.FROM_EMAIL || process.env.SMTP_USER || 'your-email@gmail.com',
    //   to: email,
    //   subject: 'Admin Login Verification Code',
    //   html: `...`
    // };
    // await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Password Reset</h2>
          <p style="color: #666; line-height: 1.6;">
            You have requested to reset your password. Click the button below to reset it:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; line-height: 1.6;">
            This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
          </p>
          <p style="color: #666; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <span style="word-break: break-all; color: #4CAF50;">${resetUrl}</span>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

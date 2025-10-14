import express from 'express';
import jwt from 'jsonwebtoken';
import process from 'process';
import { User } from '../models/User.js';
import { generateVerificationCode, sendVerificationEmail } from '../utils/emailService.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin auth routes working' });
});

// POST /api/auth/admin/send-verification - Send verification code to admin email
router.post('/send-verification', async (req, res) => {
  try {
    console.log('Send verification request received:', req.body);
    const { email } = req.body;

    if (!email) {
      console.log('No email provided');
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists and is admin
    console.log('Looking for admin user:', email);
    const adminUser = await User.findOne({
      where: { email, role: 'admin' }
    });

    if (!adminUser) {
      console.log('Admin user not found');
      return res.status(404).json({ error: 'Admin user not found' });
    }

    console.log('Admin user found:', adminUser.email);
    // Generate verification code
    const verificationCode = generateVerificationCode();
    console.log('Generated verification code:', verificationCode);

    // Store verification code in database (expires in 10 minutes)
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await adminUser.update({
      emailVerificationToken: verificationCode,
      emailVerificationExpires: verificationExpires
    });

    console.log('Updated admin user with verification code');

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode);
    console.log('Email result:', emailResult);

    if (!emailResult.success) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({
      message: 'Verification code sent to your email',
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2') // Mask email for security
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/admin/verify-email - Verify email with code and login
router.post('/verify-email', async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    // Find admin user
    const adminUser = await User.findOne({
      where: { email, role: 'admin' }
    });

    if (!adminUser) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Check if verification code is valid and not expired
    if (adminUser.emailVerificationToken !== verificationCode) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    if (new Date() > adminUser.emailVerificationExpires) {
      return res.status(401).json({ error: 'Verification code has expired' });
    }

    // Mark email as verified and clear verification token
    await adminUser.update({
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
        isEmailVerified: adminUser.isEmailVerified
      },
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/admin/login - Admin login (existing functionality)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; // Changed from username to email

    // Validate credentials
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin user by email
    const adminUser = await User.scope('withPassword').findOne({
      where: { email, role: 'admin' }
    });

    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await adminUser.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email verification is required
    if (!adminUser.isEmailVerified) {
      return res.status(403).json({
        error: 'Email verification required',
        needsVerification: true,
        email: adminUser.email
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

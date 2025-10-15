import express from 'express';
import jwt from 'jsonwebtoken';
import process from 'process';
import { User } from '../models/User.js';
import { generateVerificationCode, sendVerificationEmail } from '../utils/emailService.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// In-memory storage for verification codes (replace with Redis in production)
const verificationStore = new Map();

// Initialize Google OAuth client for admin
const adminGoogleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.GOOGLE_REDIRECT_URI}/admin`
);

// GET /api/auth/google - Initiate Google OAuth for admin
router.get('/google', (req, res) => {
  const authUrl = adminGoogleClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    state: '/admin'
  });

  res.redirect(authUrl);
});

// GET /api/auth/google/callback - Handle Google OAuth callback for admin
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }

    // Exchange authorization code for tokens
    const axios = (await import('axios')).default;

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.GOOGLE_REDIRECT_URI}/admin`,
      grant_type: 'authorization_code'
    });

    const tokens = tokenResponse.data;

    if (!tokens || !tokens.id_token) {
      throw new Error('No ID token received from Google');
    }

    // Set credentials for the OAuth client
    adminGoogleClient.setCredentials(tokens);

    // Get user info from Google
    const ticket = await adminGoogleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ error: 'Failed to get user info from Google' });
    }

    const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: profilePicture } = payload;

    // Handle different profile picture field names from Google
    const profilePictureUrl = profilePicture || payload.picture || payload.image || payload.avatar || payload.photo;

    // Check if admin user exists with this Google ID
    let adminUser = await User.findOne({
      where: { googleId, role: 'admin' }
    });

    if (!adminUser) {
      // Check if admin user exists with this email (for linking accounts)
      adminUser = await User.findOne({
        where: { email, role: 'admin' }
      });

      if (adminUser) {
        // Link Google account to existing admin user
        adminUser.googleId = googleId;
        adminUser.profilePicture = profilePictureUrl || adminUser.profilePicture;
        await adminUser.save();
      } else {
        // Check if regular user exists with this email - promote to admin
        let existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
          // Promote existing user to admin
          existingUser.googleId = googleId;
          existingUser.role = 'admin';
          existingUser.profilePicture = profilePictureUrl || existingUser.profilePicture;
          existingUser.isEmailVerified = true; // Google emails are verified
          await existingUser.save();
          adminUser = existingUser;
        } else {
          // Create new admin user with Google data
          adminUser = await User.create({
            googleId,
            email,
            firstName,
            lastName,
            profilePicture: profilePictureUrl,
            isEmailVerified: true, // Google emails are verified
            role: 'admin'
          });
        }
      }
    } else {
      // Update admin user info if it has changed
      if (firstName && adminUser.firstName !== firstName) adminUser.firstName = firstName;
      if (lastName && adminUser.lastName !== lastName) adminUser.lastName = lastName;
      if (profilePictureUrl && adminUser.profilePicture !== profilePictureUrl) adminUser.profilePicture = profilePictureUrl;
      await adminUser.save();
    }

    // Generate JWT token for admin
    const token = jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    // Redirect to admin panel with token
    res.redirect(`http://localhost:5173/admin?token=${token}`);

  } catch (error) {
    console.error('Admin Google OAuth error:', error);
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin auth routes working' });
});

// POST /api/auth/admin/signup - Start admin signup process (send verification code)
router.post('/signup', async (req, res) => {
  try {
    console.log('Admin signup request received:', req.body);
    const { email } = req.body;

    if (!email) {
      console.log('No email provided');
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user already exists (admin or regular user)
    console.log('Checking if admin user already exists:', email);
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    console.log('Creating temporary verification session for:', email);
    // Generate verification code
    const verificationCode = generateVerificationCode();
    console.log('Generated verification code:', verificationCode);

    // Store verification code in memory (expires in 10 minutes)
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    verificationStore.set(email, {
      verificationCode,
      expires: verificationExpires,
      createdAt: new Date()
    });

    console.log('Stored verification code in memory for:', email);

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode);
    console.log('Email result:', emailResult);

    if (!emailResult.success) {
      // Clean up the temporary verification data if email sending fails
      verificationStore.delete(email);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({
      message: 'Verification code sent to your email',
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email for security
      verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined // Only include in development
    });
  } catch (error) {
    console.error('Error during admin signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/admin/signup/verify - Verify email for signup
router.post('/signup/verify', async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    // Check if verification data exists in memory
    const verificationData = verificationStore.get(email);

    if (!verificationData) {
      return res.status(404).json({ error: 'Signup session not found. Please start the signup process again.' });
    }

    // Check if verification code is valid and not expired
    if (verificationData.verificationCode !== verificationCode) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    if (new Date() > verificationData.expires) {
      // Clean up expired verification data
      verificationStore.delete(email);
      return res.status(401).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Check if user already exists (double-check)
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      // Clean up verification data
      verificationStore.delete(email);
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Create the verified admin user
    const newUser = await User.create({
      email,
      role: 'admin',
      isEmailVerified: true,
      profileCompleted: false
    });

    console.log('Created verified admin user:', newUser.email);

    // Clean up verification data
    verificationStore.delete(email);

    // Generate temporary token for password setup (expires in 15 minutes)
    const tempToken = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        purpose: 'admin_signup_password_setup'
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '15m' }
    );

    res.json({
      message: 'Email verified successfully. You can now set your password.',
      tempToken: tempToken,
      email: newUser.email
    });
  } catch (error) {
    console.error('Error verifying admin signup email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/admin/signup/complete - Complete signup by setting password
router.post('/signup/complete', async (req, res) => {
  try {
    const { tempToken, password, firstName, lastName } = req.body;

    if (!tempToken || !password) {
      return res.status(400).json({ error: 'Temporary token and password are required' });
    }

    // Verify the temporary token
    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'fallback-secret-key');
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired temporary token' });
    }

    if (decoded.purpose !== 'admin_signup_password_setup') {
      return res.status(401).json({ error: 'Invalid token purpose' });
    }

    // Find the user
    const user = await User.scope('withPassword').findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified !== true) {
      return res.status(400).json({ error: 'Email verification required' });
    }

    // Update user with password and additional info
    await user.update({
      password: password, // This will be hashed by the model hook
      firstName: firstName || null,
      lastName: lastName || null,
      profileCompleted: !!(firstName || lastName) // Mark profile as completed if name provided
    });

    // Generate final JWT token for admin
    const finalToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token: finalToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profileCompleted: user.profileCompleted
      },
      message: 'Admin account created successfully'
    });
  } catch (error) {
    console.error('Error completing admin signup:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
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

    // Store verification code in memory (expires in 10 minutes)
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    verificationStore.set(email, {
      verificationCode,
      expires: verificationExpires,
      createdAt: new Date()
    });

    console.log('Updated verification code in memory for:', email);

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode);
    console.log('Email result:', emailResult);

    if (!emailResult.success) {
      // Clean up verification data if email sending fails
      verificationStore.delete(email);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({
      message: 'Verification code sent to your email',
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email for security
      verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined // Only include in development
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

    console.log(`🔍 Verifying email: ${email}`);
    console.log(`🔢 Verification code received: ${verificationCode}`);

    if (!email || !verificationCode) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    // Find admin user
    const adminUser = await User.findOne({
      where: { email, role: 'admin' }
    });

    console.log(`👤 Admin user found: ${adminUser ? 'YES' : 'NO'}`);
    if (adminUser) {
      console.log(`🔑 Stored verification token: ${adminUser.emailVerificationToken}`);
      console.log(`⏰ Token expires: ${adminUser.emailVerificationExpires}`);
      console.log(`✅ Token matches: ${adminUser.emailVerificationToken === verificationCode}`);
    }

    if (!adminUser) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Check if verification code is valid and not expired
    if (adminUser.emailVerificationToken !== verificationCode) {
      console.log(`❌ Verification failed: Token mismatch`);
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    if (new Date() > adminUser.emailVerificationExpires) {
      console.log(`❌ Verification failed: Token expired`);
      return res.status(401).json({ error: 'Verification code has expired' });
    }

    console.log(`✅ Verification successful for: ${email}`);

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

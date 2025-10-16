import express from 'express';
import jwt from 'jsonwebtoken';
import process from 'process';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { generateVerificationCode, sendVerificationEmail } from '../utils/emailService.js';
import { OAuth2Client } from 'google-auth-library';
import { Op } from 'sequelize';

// Load environment variables
dotenv.config();

const router = express.Router();

// In-memory storage for verification codes (replace with Redis in production)
const verificationStore = new Map();

// Initialize Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// GET /api/auth/google - Initiate Google OAuth
router.get('/google', (req, res) => {
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    state: req.query.redirect || '/'
  });

  res.redirect(authUrl);
});

// GET /api/auth/google/callback - Handle Google OAuth callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }

    // Exchange authorization code for tokens using axios directly
    const axios = (await import('axios')).default;

    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    const tokens = tokenResponse.data;

    if (!tokens || !tokens.id_token) {
      throw new Error('No ID token received from Google');
    }

    // Set credentials for the OAuth client
    client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await client.verifyIdToken({
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

    // Check if user exists with this Google ID
    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      // Check if user exists with this email (for linking accounts)
      user = await User.findOne({ where: { email } });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.profilePicture = profilePictureUrl || user.profilePicture;
        await user.save();
      } else {
        // Create new user with Google data - mark as verified since Google emails are verified
        user = await User.create({
          googleId,
          email,
          firstName,
          lastName,
          profilePicture: profilePictureUrl,
          isEmailVerified: true, // Google emails are verified
          role: 'user' // Default role, can be upgraded to admin later if needed
        });
      }
    } else {
      // Update user info if it has changed
      if (firstName && user.firstName !== firstName) user.firstName = firstName;
      if (lastName && user.lastName !== lastName) user.lastName = lastName;
      if (profilePictureUrl && user.profilePicture !== profilePictureUrl) user.profilePicture = profilePictureUrl;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    const redirectUrl = state ? `${state}?token=${token}` : `/?token=${token}`;
    res.redirect(`http://localhost:5173${redirectUrl}`);

  } catch (error) {
    console.error('Google OAuth error:', error);
    // For debugging - redirect to frontend with error
    res.redirect('http://localhost:5173/login?error=google_auth_failed');
  }
});

// POST /api/auth/signup - Start customer signup process (send verification code)
router.post('/signup', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if any user already exists with this email
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        return res.status(409).json({ error: 'An admin account with this email already exists. Please use the login form to sign in instead.' });
      } else {
        return res.status(409).json({ error: 'An account with this email already exists. Please use the login form to sign in instead.' });
      }
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Store verification code in memory (expires in 10 minutes)
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    verificationStore.set(email, {
      verificationCode,
      expires: verificationExpires,
      createdAt: new Date()
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode);

    if (!emailResult.success) {
      // Clean up the temporary verification data if email sending fails
      verificationStore.delete(email);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({
      success: true,
      needsVerification: true,
      message: 'Verification code sent to your email',
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email for security
      verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined // Only include in development
    });
  } catch (error) {
    console.error('Error during customer signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/signup/verify - Verify email for customer signup
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

    // Check if any user already exists (double-check)
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      // Clean up verification data
      verificationStore.delete(email);
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Create the verified customer user
    const newUser = await User.create({
      email,
      role: 'user',
      isEmailVerified: true,
      profileCompleted: false
    });

    // Clean up verification data
    verificationStore.delete(email);

    // Generate temporary token for password setup (expires in 15 minutes)
    const tempToken = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        purpose: 'customer_signup_password_setup'
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      message: 'Email verified successfully. You can now set your password.',
      tempToken: tempToken,
      email: newUser.email
    });
  } catch (error) {
    console.error('Error verifying customer signup email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/signup/complete - Complete customer signup by setting password
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

    if (decoded.purpose !== 'customer_signup_password_setup') {
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

    // Generate final JWT token for customer
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
      success: true,
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
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Error completing customer signup:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/send-verification - Send verification code to customer email
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists and is customer (not admin)
    const user = await User.findOne({
      where: { email, role: { [Op.ne]: 'admin' } }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Store verification code in memory (expires in 10 minutes)
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    verificationStore.set(email, {
      verificationCode,
      expires: verificationExpires,
      createdAt: new Date()
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode);

    if (!emailResult.success) {
      // Clean up verification data if email sending fails
      verificationStore.delete(email);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    res.json({
      success: true,
      message: 'Verification code sent to your email',
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email for security
      verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined // Only include in development
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/verify-email - Verify email with code and login
router.post('/verify-email', async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    // Find user (not admin)
    const user = await User.findOne({
      where: { email, role: { [Op.ne]: 'admin' } }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if verification code is valid and not expired
    if (user.emailVerificationToken !== verificationCode) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    if (new Date() > user.emailVerificationExpires) {
      return res.status(401).json({ error: 'Verification code has expired' });
    }

    // Mark email as verified and clear verification token
    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if email verification is required (for non-Google accounts)
    if (!user.isEmailVerified && !user.googleId) {
      return res.status(403).json({
        error: 'Email verification required',
        needsVerification: true,
        email: user.email
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/google - Direct Google OAuth (for SPA/mobile)
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, profilePicture } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ error: 'Google ID and email are required' });
    }

    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      user = await User.findOne({ where: { email } });

      if (user) {
        user.googleId = googleId;
        user.profilePicture = profilePicture || user.profilePicture;
        await user.save();
      } else {
        user = await User.create({
          googleId,
          email,
          firstName,
          lastName,
          profilePicture,
          isEmailVerified: true, // Google emails are verified
          role: 'user' // Default role
        });
      }
    } else {
      if (firstName && user.firstName !== firstName) user.firstName = firstName;
      if (lastName && user.lastName !== lastName) user.lastName = lastName;
      if (profilePicture && user.profilePicture !== profilePicture) user.profilePicture = profilePicture;
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/profile - Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        country: user.country,
        profileCompleted: user.profileCompleted,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/profile - Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        country: user.country,
        profileCompleted: user.profileCompleted,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    const {
      firstName,
      lastName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      profileCompleted
    } = req.body;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (addressLine1 !== undefined) user.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) user.addressLine2 = addressLine2;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (postalCode !== undefined) user.postalCode = postalCode;
    if (country !== undefined) user.country = country;
    if (profileCompleted !== undefined) user.profileCompleted = profileCompleted;

    await user.save();

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        country: user.country,
        profileCompleted: user.profileCompleted,
        createdAt: user.createdAt
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;

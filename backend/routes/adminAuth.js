import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const router = express.Router();

// POST /api/admin/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate credentials
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find admin user by email (username)
    const adminUser = await User.scope('withPassword').findOne({
      where: { email: username, role: 'admin' }
    });

    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await adminUser.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
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

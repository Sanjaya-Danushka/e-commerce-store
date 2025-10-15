import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

export const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 Admin auth check - Headers:', req.headers.authorization ? 'Bearer token present' : 'No auth header');
    console.log('🔐 Admin auth check - URL:', req.url);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Admin auth failed: No valid auth header');
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    console.log('🔐 Admin auth - Token length:', token.length);
    console.log('🔐 Admin auth - Token preview:', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    console.log('🔐 Admin auth - Decoded token:', JSON.stringify(decoded, null, 2));

    if (decoded.role !== 'admin') {
      console.log('❌ Admin auth failed: User role is', decoded.role, 'not admin');
      return res.status(403).json({ error: 'Admin access required' });
    }

    console.log('✅ Admin auth successful for user:', decoded.email);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Admin auth error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

    // Check if user exists (similar to profile endpoint logic)
    if (!decoded.id || !decoded.email) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

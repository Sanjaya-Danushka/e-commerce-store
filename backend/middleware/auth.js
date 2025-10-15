import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

export const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

    if (decoded.role !== 'admin') {
      // For API routes, return 403 error
      if (req.url.startsWith('/api/')) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      // For page access, redirect to login with message
      if (decoded.role === 'user') {
        return res.redirect('http://localhost:5173/admin/login?message=user_exists_not_admin');
      }

      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
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

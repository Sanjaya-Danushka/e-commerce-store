import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images/products/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Apply admin authentication to all admin routes
router.use(authenticateAdmin);

// POST /api/admin/upload - Upload product image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Return the path relative to the images folder
    const imagePath = `images/products/${req.file.filename}`;
    console.log('Image uploaded successfully:', imagePath);

    res.json({
      message: 'Image uploaded successfully',
      imagePath: imagePath,
      filename: req.file.filename,
      success: true
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// GET /api/admin/users - Get all users with pagination and search
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { email: { [Op.iLike]: `%${search}%` } },
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    res.json({
      users,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/admin/users/:id - Get single user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', async (req, res) => {
  try {
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
      profileCompleted,
      isEmailVerified
    } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedData = {};
    if (firstName !== undefined) updatedData.firstName = firstName;
    if (lastName !== undefined) updatedData.lastName = lastName;
    if (phoneNumber !== undefined) updatedData.phoneNumber = phoneNumber;
    if (addressLine1 !== undefined) updatedData.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) updatedData.addressLine2 = addressLine2;
    if (city !== undefined) updatedData.city = city;
    if (state !== undefined) updatedData.state = state;
    if (postalCode !== undefined) updatedData.postalCode = postalCode;
    if (country !== undefined) updatedData.country = country;
    if (profileCompleted !== undefined) updatedData.profileCompleted = profileCompleted;
    if (isEmailVerified !== undefined) updatedData.isEmailVerified = isEmailVerified;

    await user.update(updatedData);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET /api/admin/stats - Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalOrders = await Order.count();

    // Calculate total revenue from orders
    const ordersWithCost = await Order.findAll({
      attributes: ['totalCostCents'],
      where: { totalCostCents: { [Op.ne]: null } }
    });
    const totalRevenue = ordersWithCost.reduce((sum, order) => sum + order.totalCostCents, 0);

    const recentProducts = await Product.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentProducts,
      // Add more stats as needed
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/products - Get all products with pagination
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { keywords: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/admin/products/:id - Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/admin/products - Create new product
router.post('/products', async (req, res) => {
  try {
    const { name, image, rating, priceCents, keywords, category } = req.body;

    // Validation
    if (!name || !image || !rating || !priceCents || !keywords || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (typeof priceCents !== 'number' || priceCents < 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const newProduct = await Product.create({
      name,
      image,
      rating,
      priceCents,
      keywords: Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim()),
      category
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { name, image, rating, priceCents, keywords, category } = req.body;

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Validation
    if (name !== undefined && !name) {
      return res.status(400).json({ error: 'Product name cannot be empty' });
    }

    if (priceCents !== undefined && (typeof priceCents !== 'number' || priceCents < 0)) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (image !== undefined) updatedData.image = image;
    if (rating !== undefined) updatedData.rating = rating;
    if (priceCents !== undefined) updatedData.priceCents = priceCents;
    if (keywords !== undefined) {
      updatedData.keywords = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
    }
    if (category !== undefined) updatedData.category = category;

    await product.update(updatedData);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;

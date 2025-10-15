import express from 'express';
import { Product } from '../models/Product.js';
import { Op } from 'sequelize';
import { sequelize } from '../models/index.js';

const router = express.Router();

// GET /api/products - Get all products with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // More products for public view
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : 100000;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Build where clause for filtering
    let whereClause = {};

    // Search filter
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();

      whereClause = {
        [Op.or]: [
          // Search in product name (case-insensitive using LIKE)
          sequelize.where(
            sequelize.fn('lower', sequelize.col('name')),
            { [Op.like]: `%${searchTerm}%` }
          ),
          // Search in category (case-insensitive using LIKE)
          sequelize.where(
            sequelize.fn('lower', sequelize.col('category')),
            { [Op.like]: `%${searchTerm}%` }
          ),
          // Search in keywords array - find arrays that contain the search term
          {
            keywords: {
              [Op.like]: `%${searchTerm}%`
            }
          }
        ]
      };
    }

    // Category filter
    if (category && category !== 'all') {
      whereClause.category = { [Op.iLike]: `%${category}%` };
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 100000) {
      whereClause.priceCents = {
        [Op.gte]: Math.round(minPrice * 100),
        [Op.lte]: Math.round(maxPrice * 100)
      };
    }

    // Build order clause
    let orderClause = [[sortBy, sortOrder]];
    if (sortBy === 'priceCents') {
      orderClause = [['priceCents', sortOrder]];
    } else if (sortBy === 'rating') {
      orderClause = [['rating', sortOrder]];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: orderClause
    });

    // Filter by additional criteria that Sequelize doesn't handle well
    let filteredProducts = products;

    // Apply any additional client-side filtering if needed
    // (For now, Sequelize handles most filtering)

    res.json({
      products: filteredProducts,
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

// GET /api/products/categories - Get available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
      ],
      where: {
        category: { [Op.ne]: null }
      },
      order: [['category', 'ASC']]
    });

    const categoryList = categories.map(cat => cat.category).filter(Boolean);

    res.json({
      categories: categoryList
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
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

// GET /api/products/search - Search products (alternative endpoint)
router.get('/search', async (req, res) => {
  try {
    const { q: query, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = query.toLowerCase();
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = {};

    // Search in name and keywords
    whereClause = {
      [Op.or]: [
        sequelize.where(
          sequelize.fn('lower', sequelize.col('name')),
          { [Op.like]: `%${searchTerm}%` }
        ),
        {
          keywords: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      ]
    };

    // Category filter
    if (category && category !== 'all') {
      whereClause.category = { [Op.iLike]: `%${category}%` };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      whereClause.priceCents = {};
      if (minPrice) whereClause.priceCents[Op.gte] = Math.round(parseFloat(minPrice) * 100);
      if (maxPrice) whereClause.priceCents[Op.lte] = Math.round(parseFloat(maxPrice) * 100);
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      },
      search: {
        query,
        category,
        minPrice,
        maxPrice
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

export default router;
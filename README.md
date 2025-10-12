# 🛒 E-Commerce Store

A modern, full-stack e-commerce application built with React, Node.js, Express, and SQLite. Features user authentication, product management, shopping cart, wishlist, AI chatbot, email notifications, and comprehensive admin panel.

## ✨ Key Features

### 🛍️ **Core E-Commerce Features**
- **🔐 User Authentication** - JWT-based auth with Google OAuth and profile management
- **📧 Email Notifications** - Automated email system for orders, confirmations, and marketing
- **🛒 Shopping Cart** - Persistent cart with real-time updates and guest checkout
- **❤️ Wishlist** - Save and manage favorite products with instant sync across devices
- **📦 Order Management** - Complete order placement, tracking, and history
- **💳 Payment Integration** - Secure payment processing (ready for Stripe/PayPal)

### 🤖 **AI & Advanced Features**
- **🎯 AI-Powered Chatbot** - Trained AI assistant for customer support and product recommendations
- **📊 Advanced Analytics** - Sales tracking, user behavior analytics, and reporting
- **🎨 Dynamic UI** - Responsive design with animations and modern UX patterns
- **🔍 Smart Search** - Product search with filtering, sorting, and recommendations

### 👨‍💼 **Admin & Management**
- **📋 Admin Panel** - Full admin dashboard at `/admin` for complete store management
- **📦 Product Management** - Add, edit, delete products with inventory tracking
- **👥 User Management** - Customer data, order history, and support management
- **📈 Sales Dashboard** - Revenue tracking, popular products, and business insights

### 📱 **Pages & Navigation**
- **🏠 Home Page** - Hero section, featured products, categories, testimonials
- **🛍️ Products Page** - Advanced filtering, search, sorting, and product grid
- **💸 Sale Page** - Dedicated sales section with promotional banners
- **🆕 New Arrivals** - Latest products with special highlighting
- **❤️ Wishlist Page** - Dedicated page for managing saved items
- **🛒 Cart & Checkout** - Complete checkout flow with guest and user options
- **👤 Profile Management** - User profiles, order history, and settings

### 📄 **Footer Pages**
- **ℹ️ About Us** - Company information and mission
- **📞 Contact** - Contact forms and information
- **📋 Terms of Service** - Legal terms and conditions
- **🔒 Privacy Policy** - Data protection and privacy information
- **♿ Accessibility** - Accessibility compliance and features
- **💼 Careers** - Job opportunities and company culture
- **📰 Press** - Media kit and press releases
- **📖 Blog** - Company blog and articles
- **🤝 Affiliate Program** - Partnership and affiliate opportunities
- **🏪 Wholesale** - B2B wholesale information
- **📦 Shipping Info** - Shipping rates and policies
- **↩️ Returns & Exchanges** - Return policies and procedures
- **📏 Size Guide** - Product sizing information
- **🔍 Track Order** - Order tracking functionality
- **🎁 Gift Cards** - Digital gift card system

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm

### Installation

1. **Clone & install:**
   ```bash
   git clone <your-repo-url>
   cd e-commerce-store
   npm install
   cd backend && npm install && cd ..
   ```

2. **Configure environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your settings (database, email, JWT secrets, etc.)
   ```

3. **Start servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Open browser:**
   - App: http://localhost:5173
   - Admin: http://localhost:5173/admin
   - API: http://localhost:3000

## 🗂️ Project Structure

```
e-commerce-store/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── Pages/             # All page components
│   ├── context/           # React context providers
│   └── utils/             # Helper functions
├── backend/               # Node.js/Express backend
│   ├── controllers/       # API route handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── services/         # Business logic services
├── database.sqlite       # SQLite database
└── package.json         # Dependencies
```

## 🔌 API Overview

### **Authentication & Users**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### **Products & Inventory**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### **Shopping Cart**
- `GET /api/cart-items` - Get user's cart
- `POST /api/cart-items` - Add item to cart
- `PUT /api/cart-items/:id` - Update cart item
- `DELETE /api/cart-items/:id` - Remove from cart

### **Wishlist**
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### **Orders & Checkout**
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)

### **Email & Notifications**
- `POST /api/subscribe` - Newsletter subscription
- `POST /api/contact` - Contact form submissions
- Email notifications for orders, confirmations, and marketing

### **Admin & Analytics**
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/orders` - Get all orders (admin)
- `GET /api/admin/analytics` - Sales analytics (admin)

## 🔐 Admin Access

Admin panel available at `/admin` for complete store management:
- User management and support
- Product inventory and categories
- Order processing and tracking
- Sales analytics and reporting
- Email campaign management

## 🤖 AI Chatbot

Integrated AI-powered chatbot trained on product catalog and customer service data:
- **Product Recommendations** - Suggests items based on user preferences
- **Customer Support** - Answers questions about orders, shipping, returns
- **Sales Assistance** - Helps users find products and complete purchases
- **24/7 Availability** - Always online for instant support

## 📧 Email System

Comprehensive email notification system:
- **Order Confirmations** - Automatic emails when orders are placed
- **Shipping Notifications** - Updates when orders ship
- **Marketing Emails** - Newsletter and promotional campaigns
- **Password Reset** - Secure password recovery emails
- **Contact Forms** - Notifications for customer inquiries

## 🛠️ Tech Stack

### **Frontend**
- **React** - Modern React with hooks and context
- **JavaScript** - ES6+ with modern features
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database with Sequelize ORM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email sending capabilities

### **Development Tools**
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting

## 🚀 Production Deployment

```bash
# Build frontend
npm run build

# Backend is ready for deployment as-is
# Deploy to your preferred hosting service
```

## 📋 Features Implemented

### ✅ **Completed Features**
- [x] **User Authentication** - JWT-based with Google OAuth
- [x] **Product Management** - CRUD operations with admin panel
- [x] **Shopping Cart** - Persistent with guest checkout
- [x] **Wishlist** - Save/unsave products with instant sync
- [x] **Order System** - Complete order lifecycle
- [x] **Email Notifications** - Automated email system
- [x] **AI Chatbot** - Trained assistant for customer support
- [x] **Admin Dashboard** - Complete store management
- [x] **Responsive Design** - Mobile-first approach
- [x] **All Footer Pages** - Complete site navigation
- [x] **Search & Filtering** - Advanced product discovery
- [x] **Payment Ready** - Integration points prepared
- [x] **Analytics Dashboard** - Sales and user metrics

## 🔒 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Comprehensive validation on all inputs
- **CORS Protection** - Cross-origin resource sharing configured
- **Rate Limiting** - API rate limiting to prevent abuse
- **SQL Injection Protection** - Parameterized queries

## 📄 License

MIT License - see LICENSE file for details.

---

*Built with ❤️ using modern web technologies*

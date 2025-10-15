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

## 🚀 Developer Setup

### **Prerequisites**
- Node.js (v16+), npm
- Gmail account (for email) or SendGrid/Mailgun
- Google Cloud Console account (for OAuth)
- Stripe account (for payments)

### **Quick Setup**
1. Clone and install dependencies
2. Copy environment template: `cp .env.example backend/.env`
3. Get API keys from services below
4. Update `backend/.env` with your real credentials
5. Start servers: `npm run dev` (frontend) + `cd backend && npm run dev` (backend)

### **🔑 Required API Keys Setup**

#### **📧 Email Configuration (Choose One)**

**Option 1: Gmail SMTP**
1. Enable 2-factor authentication on your Gmail account
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use your Gmail address and the generated app password

**Option 2: SendGrid**
1. Create account: https://sendgrid.com
2. Get API key: https://app.sendgrid.com/settings/api_keys
3. Verify your domain for custom email addresses

**Option 3: Mailgun**
1. Create account: https://mailgun.com
2. Get API key: https://app.mailgun.com/app/domains
3. Add your domain for custom email addresses

#### **🔐 Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.developers.google.com)
2. Create new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Client ID)
5. Add redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret

#### **💳 Stripe Payment Setup**
1. Create Stripe account: https://stripe.com
2. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
3. Copy **Test Secret Key** (starts with `sk_test_`)
4. Copy **Test Publishable Key** (starts with `pk_test_`)

### **⚙️ Environment Configuration**

**Update `backend/.env` with your real values:**

```bash
# Email (choose one method)
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-gmail-app-password

# OR SendGrid
SENDGRID_API_KEY=SG.your_sendgrid_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### **🚀 Running the Project**

```bash
# Terminal 1 - Backend API Server
cd backend && npm run dev

# Terminal 2 - Frontend Development Server
npm run dev
```

**URLs:**
- **App:** http://localhost:5173
- **Admin:** http://localhost:5173/admin
- **API:** http://localhost:3000

### **🔧 Troubleshooting**

**Common Issues:**
- **Email not sending?** Check SMTP credentials and app passwords
- **OAuth not working?** Verify redirect URI matches exactly
- **Stripe errors?** Ensure you're using test keys, not live keys
- **Database errors?** Make sure SQLite database file exists

**Getting Help:**
- Check browser console for frontend errors
- Check terminal for backend errors
- All API endpoints documented in sections below

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
├── scripts/              # Utility scripts (demo admin setup, etc.)
├── database.sqlite       # SQLite database
└── package.json         # Dependencies
```

## 🔌 API Overview

### **Authentication & Users**

- `POST /api/auth/signup` - Start customer signup (email verification)
- `POST /api/auth/signup/verify` - Verify email for customer signup
- `POST /api/auth/signup/complete` - Complete signup by setting password
- `POST /api/auth/login` - User login with email verification check
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

### **💳 Stripe Payment Testing**

#### **Test Card Details (Development Only)**

For testing the Stripe payment integration, use these test cards:

| Card Type                 | Card Number           | Expiry                        | CVC                      | Expected Result    |
| ------------------------- | --------------------- | ----------------------------- | ------------------------ | ------------------ |
| **✅ Successful**         | `4242 4242 4242 4242` | Any future date (e.g., 12/25) | Any 3 digits (e.g., 123) | Payment succeeds   |
| **❌ Declined**           | `4000 0000 0000 0002` | Any future date               | Any 3 digits             | Payment declined   |
| **⚠️ Insufficient Funds** | `4000 0000 0000 9995` | Any future date               | Any 3 digits             | Insufficient funds |

#### **Testing Steps**

1. **Navigate to checkout page** in your browser
2. **Select Credit Card** as payment method
3. **Enter test card details** above
4. **Complete the order** - should process successfully
5. **Check backend logs** for payment processing confirmation

#### **Stripe Dashboard Testing**

1. **Go to [Stripe Dashboard](https://dashboard.stripe.com/test/payments)**
2. **View test payments** to confirm transactions
3. **Check payment status** and details

> **⚠️ Important:** These test cards only work in test mode and won't charge real money.

### **Email & Notifications**

- `POST /api/subscribe` - Newsletter subscription
- `POST /api/contact` - Contact form submissions
- Email notifications for orders, confirmations, and marketing

### **Admin & Analytics**

- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/orders` - Get all orders (admin)
- `GET /api/admin/analytics` - Sales analytics (admin)
- `GET /api/admin/admins` - Get all admin users (admin only)
- `POST /api/admin/admins` - Create new admin user (admin only)
- `PUT /api/admin/admins/:id` - Update admin user (admin only)
- `DELETE /api/admin/admins/:id` - Delete admin user (admin only)

## 🔐 Admin Access

Admin panel available at `/admin` for complete store management:

### **Demo Admin Credentials**

- **Email:** `admin@example.com`
- **Password:** `Admin123!`
- **Access:** Full admin privileges for testing all admin features

> **Note:** For security, change these credentials in production and disable demo accounts.

### **Admin Features**

- User management and support
- Product inventory and categories
- Order processing and tracking
- Sales analytics and reporting
- Email campaign management
- Admin account management (create, edit, delete admins)

## 🔒 Enhanced Security Features

### **Authentication & Authorization**

- **JWT Tokens** - Secure, stateless authentication with configurable expiration
- **Password Hashing** - bcrypt with salt rounds for maximum security
- **Role-Based Access Control (RBAC)** - Admin vs User permissions
- **Google OAuth Integration** - Social login with account linking

### **API Security**

- **Input Validation** - Comprehensive validation using Sequelize validators
- **SQL Injection Protection** - Parameterized queries and ORM usage
- **CORS Protection** - Configurable cross-origin resource sharing
- **Rate Limiting** - API endpoint protection (configurable)
- **Request Logging** - Detailed logging for security monitoring

### **Data Security**

- **Password Requirements** - Strong password policies enforced
- **Email Verification** - Required email confirmation for new accounts
- **Session Management** - Secure token handling and automatic expiration
- **Data Encryption** - Sensitive data protection at rest and in transit

### **Admin Security**

- **Admin Account Creation** - Secure admin account management
- **Permission Validation** - Role-based route protection
- **Audit Logging** - Admin action tracking for compliance
- **Secure Admin Routes** - JWT authentication required for all admin endpoints

### **Best Practices Implemented**

- **Environment Variables** - Sensitive configuration in environment files
- **Error Handling** - Secure error messages (no sensitive data exposure)
- **HTTPS Ready** - SSL/TLS configuration ready for production
- **Security Headers** - Helmet.js integration for additional protection
- **Input Sanitization** - All user inputs validated and sanitized
- **Session Security** - Secure token handling with proper expiration
- **Password Policies** - Strong password requirements enforced
- **Audit Logging** - Admin actions tracked for compliance monitoring

## 📋 Demo Admin Setup

### **Creating Demo Admin Account**

For testing purposes, you can create a demo admin account:

```bash
# Using the admin panel UI (recommended)
1. Start the application
2. Navigate to http://localhost:5173/admin/login
3. Click "Create Admin Account"
4. Enter: admin@example.com / Admin123!

# Or using API (if you have admin access)
curl -X POST http://localhost:3000/api/admin/admins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "firstName": "Demo",
    "lastName": "Admin"
  }'
```

### **Security Considerations for Demo Accounts**

- Change demo credentials before production deployment
- Demo accounts should be disabled in production environments
- Use strong, unique passwords for production admin accounts
- Enable email verification for production admin accounts

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
- [x] **Admin Account Management** - Create, edit, delete admin users
- [x] **Enhanced Security** - RBAC, audit logging, secure admin routes
- [x] **Responsive Design** - Mobile-first approach
- [x] **All Footer Pages** - Complete site navigation
- [x] **Search & Filtering** - Advanced product discovery
- [x] **Payment Ready** - Integration points prepared
- [x] **Analytics Dashboard** - Sales and user metrics

## 🔒 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin vs User permissions with route protection
- **Input Validation** - Comprehensive validation on all inputs
- **CORS Protection** - Cross-origin resource sharing configured
- **Rate Limiting** - API rate limiting to prevent abuse
- **SQL Injection Protection** - Parameterized queries
- **Admin Account Security** - Secure admin creation and management
- **Audit Logging** - Admin action tracking for compliance
- **Session Management** - Secure token handling and expiration

## 📄 License

MIT License - see LICENSE file for details.

## 📋 Latest Updates

### **🔐 Enhanced Admin Security & Management**

- **Complete Admin CRUD Operations** - Create, read, update, delete admin accounts
- **Smart Account Promotion** - Automatically promotes regular users to admin when creating admin accounts
- **Advanced Error Handling** - Clear, actionable error messages for different scenarios
- **Audit Logging** - Admin actions tracked for compliance and security monitoring
- **Role-Based Access Control** - Enhanced permissions system with admin-only routes

### **🛠️ Developer Experience Improvements**

- **Demo Admin Setup Script** - Automated creation of demo admin accounts
- **Comprehensive API Documentation** - Updated with all admin management endpoints
- **Enhanced Security Documentation** - Detailed security features and best practices
- **Production-Ready Security** - RBAC, input validation, and secure error handling

### **🎯 Customer Authentication System**

- **Email Verification Flow** - Complete signup process with email verification
- **Google OAuth Integration** - Seamless social login for customers
- **Enhanced Login Security** - Email verification required for password-based accounts
- **Password Setup Flow** - Secure account completion after email verification
- **Account Recovery** - Email verification for existing accounts

### **🎯 Admin Panel Features**

- **Admin Account Management** - Full CRUD operations for admin users
- **User Search & Filtering** - Advanced search across admin accounts
- **Email Verification Management** - Toggle email verification status
- **Profile Management** - Update admin names, phone numbers, and details
- **Secure Authentication** - JWT-based admin authentication with role validation

---

**🔑 Demo Admin Access:** `admin@example.com` / `Admin123!`
**🌐 Admin Panel:** http://localhost:5173/admin
**📚 Documentation:** Comprehensive security and API documentation included

_Built with ❤️ using modern web technologies_

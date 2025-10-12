# 🛒 E-Commerce Store

A modern, full-stack e-commerce application built with React, Node.js, Express, and SQLite. Features user authentication, product management, shopping cart, wishlist, and admin panel.

## ✨ Key Features

- **🔐 User Authentication** - JWT-based auth with Google OAuth
- **🛍️ Product Management** - Browse, search, and filter products
- **🛒 Shopping Cart** - Persistent cart with real-time updates
- **❤️ Wishlist** - Save and manage favorite products
- **📦 Order Management** - Complete order placement and tracking
- **👨‍💼 Admin Panel** - Full admin dashboard at `/admin`
- **📱 Responsive Design** - Works on all devices
- **🔒 Secure** - Password hashing, input validation, CORS

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
   # Edit .env with your settings
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
├── src/           # React frontend
├── backend/       # Node.js/Express backend
└── database.sqlite # SQLite database
```

## 🔌 API Overview

- **Authentication:** `/api/auth/*`
- **Products:** `/api/products`
- **Cart:** `/api/cart-items`
- **Orders:** `/api/orders`
- **Wishlist:** `/api/wishlist`

## 🔐 Admin Access

Admin panel available at `/admin` for user and product management.

## 🛠️ Tech Stack

- **Frontend:** React, JavaScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite with Sequelize ORM
- **Authentication:** JWT tokens, bcrypt

## 🚀 Production

```bash
npm run build  # Build frontend
# Deploy backend as-is
```

## 📄 License

MIT License - see LICENSE file for details.

---

*Built with ❤️ using modern web technologies*

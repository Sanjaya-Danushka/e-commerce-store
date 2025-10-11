# 🛒 E-Commerce Store

A full-featured e-commerce application built with React, Node.js, Express, and SQLite. This application provides a complete shopping experience with user authentication, product management, shopping cart, wishlist, and order tracking.

## ✨ Features

### 🔐 User Authentication
- **Secure Login/Registration** with JWT tokens
- **Google OAuth** integration
- **Password hashing** for security
- **Session management** with automatic logout
- **Profile completion** flow for new users

### 🛍️ Product Management
- **Product catalog** with search and filtering
- **Category-based browsing** (Electronics, Fashion, Home & Garden, Sports)
- **Product ratings and reviews**
- **Inventory management**
- **Dynamic pricing** and sale indicators

### 🛒 Shopping Cart
- **Add/remove products** with quantity selection
- **Real-time cart updates** with visual feedback
- **Persistent cart** across browser sessions
- **Guest checkout** support

### ❤️ Wishlist
- **Save favorite products** for later
- **Persistent wishlist** across login sessions
- **Visual indicators** for wishlisted items
- **One-click add/remove** functionality

### 📦 Order Management
- **Complete order placement** flow
- **Order history** with detailed tracking
- **User-specific orders** (authenticated users only)
- **Order status** and delivery tracking
- **Order confirmation** and receipt generation

### 🎨 Modern UI/UX
- **Responsive design** for all devices
- **Smooth animations** and transitions
- **Dark/light theme** support
- **Loading states** and error handling
- **Accessibility** features

### 🔧 Technical Features
- **RESTful API** with Express.js
- **SQLite database** with Sequelize ORM
- **JWT authentication** middleware
- **File upload** support for product images
- **Error handling** and logging
- **Environment configuration**

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd e-commerce-store
   ```

2. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the development servers:**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   # In the root directory
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
e-commerce-store/
├── public/                 # Static assets
│   └── datasets/          # Sample datasets
├── src/                   # React frontend
│   ├── components/        # Reusable UI components
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── Pages/            # Page components
│   ├── utils/            # Utility functions
│   └── assets/           # Static assets
├── backend/              # Node.js/Express backend
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── defaultData/     # Seed data
│   └── images/          # Product images
└── database.sqlite      # SQLite database file
```

## 🗄️ Database Models

### User
- Email, password, profile information
- Authentication tokens
- Profile completion status

### Product
- Name, description, price, images
- Category, ratings, inventory
- Search and filter capabilities

### CartItem
- User cart contents
- Product references and quantities
- Delivery options

### Order
- Complete order information
- User association
- Product details and pricing
- Delivery tracking

### Wishlist
- User's favorite products
- Quick access for future purchases

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Cart
- `GET /api/cart-items` - Get user's cart
- `POST /api/cart-items` - Add item to cart
- `PUT /api/cart-items/:productId` - Update cart item
- `DELETE /api/cart-items/:productId` - Remove from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Place new order
- `GET /api/orders/:orderId` - Get order details

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

## 🔐 Security Features

- **JWT token authentication** for API access
- **Password hashing** using bcrypt
- **CORS configuration** for cross-origin requests
- **Input validation** and sanitization
- **SQL injection prevention** with Sequelize ORM
- **File upload restrictions** and validation

## 🎯 Key Features Implemented

### ✅ Cart Persistence
- Cart items persist across browser sessions
- Real-time updates when items are added/removed
- Visual feedback for cart changes

### ✅ Wishlist Persistence
- Wishlist items saved to database
- Persistent across login/logout sessions
- Visual indicators for wishlisted items

### ✅ User-Specific Orders
- Orders filtered by authenticated user
- Order history with complete details
- Secure access to user's order data only

### ✅ Authentication Integration
- Complete login/logout flow
- Automatic data fetching on authentication
- Session management and token refresh

## 🧪 Testing

The application includes comprehensive testing for:
- API endpoint functionality
- Database operations
- Authentication flows
- User interface interactions

## 🚀 Deployment

### Build for Production
```bash
# Frontend
npm run build

# Backend is ready for deployment as-is
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React, Node.js, Express, and SQLite
- UI components inspired by modern e-commerce platforms
- Authentication system using industry-standard practices

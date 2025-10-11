# E-commerce Store Admin Panel

## Overview
This e-commerce store includes a complete admin panel for managing products with full CRUD (Create, Read, Update, Delete) operations.

## Features

### Admin Authentication
- Secure JWT-based authentication system
- Role-based access control (admin only)
- Token expiration handling

### Product Management
- **View Products**: Paginated product listing with search functionality
- **Add Products**: Create new products with validation
- **Edit Products**: Update existing product information
- **Delete Products**: Remove products with confirmation
- **Search & Filter**: Search products by name or keywords

## Technology Stack

### Frontend
- **React** - Component-based UI library
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - JSON Web Tokens for authentication
- **Sequelize** - ORM for database operations
- **SQLite** - Database for development

### Authentication
- `POST /api/auth/admin/login` - Admin login

### Product Management
- `GET /api/admin/products` - Get all products (paginated, searchable)
- `GET /api/admin/products/:id` - Get single product
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/stats` - Get admin dashboard statistics

## Admin Panel Access

### Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Access URLs
- Admin Login: `http://localhost:3000/admin/login`
- Admin Panel: `http://localhost:3000/admin`

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The admin authentication middleware and routes are already configured in:
   - `middleware/auth.js` - JWT authentication middleware
   - `routes/admin.js` - Product CRUD operations
   - `routes/adminAuth.js` - Admin login endpoint

### Frontend Setup
The admin panel components are already integrated into the main application:
- `src/Pages/AdminPage.jsx` - Main admin dashboard
- `src/Pages/AdminLoginPage.jsx` - Admin login page
- `src/services/adminAPI.js` - API service for admin operations

## Usage Guide

### Starting the Application
1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. The application will be available at `http://localhost:3000`

### Admin Operations

#### 1. Login Process
1. Navigate to `/admin/login`
2. Enter admin credentials
3. Click "Login" to access the admin panel

#### 2. Viewing Products
- The admin panel displays products in a grid layout
- Use the search bar to find specific products
- Navigate through pages using pagination controls

#### 3. Adding Products
1. Click "Add New Product" button
2. Fill in the product details:
   - Name (required)
   - Image path (required)
   - Price in cents (required)
   - Rating stars (0-5)
   - Rating count
   - Keywords (comma-separated)
3. Click "Create" to save

#### 4. Editing Products
1. Click "Edit" button on any product card
2. Modify the product information
3. Click "Update" to save changes

#### 5. Deleting Products
1. Click "Delete" button on any product card
2. Confirm deletion in the popup dialog
3. Product will be permanently removed

## Product Data Structure

Each product contains:
```javascript
{
  id: "uuid",
  name: "Product Name",
  image: "images/products/filename.jpg",
  rating: {
    stars: 4.5,
    count: 100
  },
  priceCents: 2999, // Price in cents
  keywords: ["category", "tags"]
}
```

## Security Features

- JWT token-based authentication
- Automatic token expiration handling
- Protected admin routes
- Input validation for product creation/editing
- Role-based access control

## Development Notes

### Environment Variables
Add to your `.env` file:
```
JWT_SECRET=your-secret-key
PORT=3000
```

### Database
- Uses SQLite database with Sequelize ORM
- Products are automatically seeded on first run
- Database file: `backend/database.sqlite`

### Image Storage
- Product images should be placed in `backend/images/products/`
- Image paths in products reference this directory

## Troubleshooting

### Common Issues

1. **"Access token required" error**
   - Ensure you're logged in as admin
   - Check if token is stored in localStorage

2. **"Invalid credentials" error**
   - Use the correct demo credentials
   - Check if the backend server is running

3. **Product images not loading**
   - Ensure images are in `backend/images/products/`
   - Check image file paths in product data

4. **Database connection issues**
   - Check if `database.sqlite` exists
   - Verify Sequelize configuration

### Logs
- Backend logs are displayed in the console
- Check browser console for frontend errors
- Database operations are logged to console

## Production Deployment

For production use:

1. **Security**:
   - Change default admin credentials
   - Use strong JWT secret
   - Implement HTTPS
   - Add rate limiting

2. **Database**:
   - Use PostgreSQL or MySQL instead of SQLite
   - Set up database backups

3. **Authentication**:
   - Store admin credentials securely
   - Implement password hashing
   - Add session management

4. **Images**:
   - Use cloud storage (AWS S3, Cloudinary)
   - Implement image upload functionality

## Contributing

To extend the admin panel:

1. Add new API endpoints in `routes/admin.js`
2. Update the frontend service in `services/adminAPI.js`
3. Add new UI components in `Pages/AdminPage.jsx`
4. Update this documentation

## Support

For issues or questions:
- Check the troubleshooting section
- Review browser console logs
- Verify backend server logs

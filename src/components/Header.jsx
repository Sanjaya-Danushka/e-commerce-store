import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ cart, wishlist }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const totalQuantity = useMemo(() => {
    const quantity = cart ? cart.reduce((total, cartItem) => total + cartItem.quantity, 0) : 0;
    console.log('Header - Cart quantity calculated:', quantity);
    return quantity;
  }, [cart]);

  const wishlistCount = useMemo(() => {
    const count = wishlist ? wishlist.length : 0;
    console.log('Header - Wishlist count calculated:', count, 'wishlist:', wishlist);
    return count;
  }, [wishlist]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">ShopEase</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors">
              Products
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors">
              Orders
            </Link>
            <Link to="/sale" className="text-red-600 hover:text-red-700 text-lg font-medium transition-colors">
              Sale
            </Link>
            <Link to="/new-arrivals" className="text-gray-700 hover:text-gray-900 text-lg font-medium transition-colors">
              New
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Animated Search */}
            <div className="relative flex items-center">
              {/* Search Icon */}
              {!isSearchExpanded && (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {/* Expanded Search Bar */}
              <div className={`relative transition-all duration-500 ease-out ${isSearchExpanded ? 'w-80 opacity-100 scale-100' : 'w-0 opacity-0 scale-95 overflow-hidden'}`}>
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      // Auto-close after short delay when focus is lost
                      setTimeout(() => {
                        setIsSearchExpanded(false);
                        setSearchQuery('');
                      }, 150);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-base"
                    autoFocus
                  />
                </form>
              </div>
            </div>

            {/* Authentication Section */}
            {isAuthenticated && user ? (
              <>
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback to default icon if profile picture fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.profilePicture ? 'hidden' : ''}`} style={{backgroundColor: '#D1D5DB'}}>
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="hidden lg:block text-sm font-medium">
                      {user.firstName || user.email}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login and Signup buttons */}
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-gray-900 text-white hover:bg-gray-800 px-3 py-2 text-sm font-medium rounded-md transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}

            <Link to="/wishlist" className="relative text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/checkout" className="relative text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              <Link to="/" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/products" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Products
              </Link>
              <Link to="/orders" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Orders
              </Link>
              <Link to="/sale" className="block text-red-600 hover:text-red-700 px-3 py-2 text-sm font-medium">
                Sale
              </Link>
              <Link to="/new-arrivals" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                New Arrivals
              </Link>

              {!isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <Link to="/login" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    Sign in
                  </Link>
                  <Link to="/signup" className="block text-gray-900 hover:text-gray-800 px-3 py-2 text-sm font-medium">
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <Link to="/profile" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    Your Profile
                  </Link>
                  <Link to="/orders" className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                    Your Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close profile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

const Header = ({ cart }) => {
  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Enhanced Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:shadow-md transition-all duration-200">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">ShopEase</span>
                <div className="text-xs text-gray-500 font-medium">Premium Store</div>
              </div>
            </Link>
          </div>

          {/* Enhanced Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link
              to="/"
              className="relative text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-gray-50 group"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gray-900 transition-all duration-200 group-hover:w-full"></span>
            </Link>

            <Link
              to="/sale"
              className="relative text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 group"
            >
              <span className="relative z-10">🔥 Sale</span>
            </Link>

            <Link
              to="/new-arrivals"
              className="relative text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-emerald-50 group"
            >
              <span className="relative z-10">🆕 New</span>
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-emerald-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Clean User Actions */}
          <div className="flex items-center space-x-3 relative">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
            >
              <svg className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link
              to="/account"
              className="text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
            >
              <svg className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <Link
              to="/checkout"
              className="relative text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center group"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
              <span className="relative z-10">Cart</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 bg-gray-50">
            <nav className="space-y-2">
              <Link to="/" className="flex items-center text-gray-700 hover:text-gray-900 px-4 py-3 text-base font-semibold hover:bg-white rounded-lg mx-2 transition-colors">
                <span className="mr-3">🏠</span>
                <span>Home</span>
              </Link>

              <Link to="/sale" className="flex items-center text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-3 text-base font-bold rounded-lg mx-2 transition-all shadow-lg transform hover:scale-105">
                <span className="mr-3">🔥</span>
                <span>Sale</span>
              </Link>

              <Link to="/new-arrivals" className="flex items-center text-gray-700 hover:text-gray-900 px-4 py-3 text-base font-semibold hover:bg-emerald-50 rounded-lg mx-2 transition-colors">
                <span className="mr-3">🆕</span>
                <span>New Arrivals</span>
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Search Dropdown */}
      {isSearchOpen && (
        <div className="absolute top-0 right-16 mt-1 z-50">
          <div ref={searchRef} className="bg-white border border-gray-200 rounded-lg shadow-xl w-64">
            <div className="p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-10 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  autoFocus
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-md hover:bg-gray-800 transition-colors text-xs font-medium"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import React from "react";
import "./header.css";
import { Link } from "react-router";

const Header = ({ cart }) => {
  let totalQuantity = 0;

  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Brand Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">ShopEase</span>
              </div>
            </Link>
          </div>

          {/* Right section - Orders & Cart */}
          <div className="flex items-center space-x-6">
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              to="/orders"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Orders
            </Link>

            <Link
              to="/checkout"
              className="relative text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
            >
              <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
              <span className="ml-1">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

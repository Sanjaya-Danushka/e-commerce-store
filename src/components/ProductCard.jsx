import React, { useState } from "react";
import axios from "axios";
import { formatMoney } from "../utils/money";

const ProductCard = ({
  product,
  // cart = [],
  wishlist = [],
  refreshCart = () => {},
  updateWishlist = () => {},
  showAddToCart = true,
  showWishlist = true,
  className = "",
}) => {
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async () => {
    try {
      await axios.post("/api/cart-items", {
        productId: product.id,
        quantity: 1, // Default quantity
      });
      refreshCart();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleWishlistToggle = async () => {
    const isInWishlist = wishlist.some((item) => item.productId === product.id);

    if (isInWishlist) {
      // Remove from wishlist via API
      try {
        await axios.delete(`/api/wishlist/${product.id}`);
        const updatedWishlist = wishlist.filter(
          (item) => item.productId !== product.id
        );
        updateWishlist(updatedWishlist);
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        alert("Failed to remove from wishlist.");
      }
    } else {
      // Add to wishlist via API
      try {
        await axios.post("/api/wishlist", {
          productId: product.id,
        });
        const newWishlistItem = {
          productId: product.id,
          dateAdded: new Date().toISOString(),
        };
        const updatedWishlist = [...wishlist, newWishlistItem];
        updateWishlist(updatedWishlist);
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        alert("Failed to add to wishlist.");
      }
    }
  };

  const isInWishlist = wishlist.some((item) => item.productId === product.id);

  return (
    <div
      className={`group product-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-4 transform hover:-translate-y-1 border border-gray-100 hover:border-blue-200 ${className}`}>
      <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md">
        <img
          className="product-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          src={`/${product.image}`}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Sale badge */}
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          SALE
        </div>

        {/* Wishlist button */}
        {showWishlist && (
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 hover:scale-110 shadow-lg ${
              isInWishlist
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white/90 backdrop-blur-sm hover:bg-gray-100"
            }`}>
            <svg
              className={`w-4 h-4 ${
                isInWishlist ? "text-white" : "text-gray-600 hover:text-red-500"
              } transition-colors`}
              fill={isInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="product-name h-12">
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </h3>
        </div>

        <div className="product-rating-container flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3 h-3 ${
                  star <= (product.rating?.stars || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <div className="product-rating-count text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
            ({product.rating?.count || 0})
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="product-price text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {formatMoney(product.priceCents)}
          </div>
          <span className="text-xs text-gray-500 line-through">
            {formatMoney(Math.round(product.priceCents * 1.3))}
          </span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Save {Math.round(30)}%
          </span>
        </div>

        {showAddToCart && (
          <button
            className="add-to-cart-button w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={handleAddToCart}>
            <span className="flex items-center">
              Add to Cart
              <svg
                className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </span>
          </button>
        )}

        <div
          className={`added-to-cart flex items-center justify-center text-green-600 text-xs font-medium bg-green-50 rounded-lg py-1 transition-all duration-300 ${
            addedToCart
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1"
          }`}>
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Added to cart!
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

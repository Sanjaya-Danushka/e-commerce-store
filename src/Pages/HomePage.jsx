import React from "react";
import "./HomePage.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { formatMoney } from "../utils/money";

const HomePage = ({ cart, refreshCart }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("/api/products");
      setProducts(response.data);
      setAllProducts(response.data);
      // Initialize quantities to 1 for each product
      const initialQuantities = {};
      response.data.forEach((product) => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === "") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filtered);
    }
  }, [searchQuery, allProducts]);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(quantity),
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Home</title>
      <Header cart={cart} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Shop the latest trends with unbeatable prices
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full px-6 py-4 text-gray-900 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/20"
                  value={searchQuery || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Products'}
            </h2>
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Search
              </button>
            )}
          </div>

          {products.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try searching for something else or browse our featured products.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {products.map((product) => {
                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 group max-w-sm mx-auto">
                    <div className="aspect-[4/3] mb-6 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        className="product-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={`/${product.image}`}
                      />
                    </div>

                    <div className="product-name h-16 mb-4">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    <div className="product-rating-container flex items-center mb-4">
                      <img
                        className="product-rating-stars w-20 h-5 mr-3"
                        src={`/images/ratings/rating-${product.rating.stars * 10}.png`}
                      />
                      <div className="product-rating-count text-green-600 text-sm font-medium">
                        ({product.rating.count})
                      </div>
                    </div>

                    <div className="product-price text-xl font-bold text-gray-900 mb-4">
                      {formatMoney(product.priceCents)}
                    </div>

                    <div className="product-quantity-container mb-6">
                      <select
                        value={quantities[product.id] || 1}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="1">Qty: 1</option>
                        <option value="2">Qty: 2</option>
                        <option value="3">Qty: 3</option>
                        <option value="4">Qty: 4</option>
                        <option value="5">Qty: 5</option>
                        <option value="6">Qty: 6</option>
                        <option value="7">Qty: 7</option>
                        <option value="8">Qty: 8</option>
                        <option value="9">Qty: 9</option>
                        <option value="10">Qty: 10</option>
                      </select>
                    </div>

                    <div
                      className={`added-to-cart flex items-center text-green-600 text-base font-medium mb-4 transition-opacity duration-300 ${
                        addedToCart[product.id] ? 'opacity-100' : 'opacity-0'
                      }`}>
                      <img src="/images/icons/checkmark.png" className="w-5 h-5 mr-2" />
                      Added to cart!
                    </div>

                    <button
                      className="add-to-cart-button w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center text-base"
                      onClick={() => {
                        axios
                          .post("/api/cart-items", {
                            productId: product.id,
                            quantity: quantities[product.id] || 1,
                          })
                          .then(() => {
                            refreshCart();
                            setAddedToCart({
                              ...addedToCart,
                              [product.id]: true,
                            });
                            setTimeout(() => {
                              setAddedToCart({
                                ...addedToCart,
                                [product.id]: false,
                              });
                            }, 2000);
                          })
                          .catch((error) => {
                            console.error("Error adding to cart:", error);
                            alert("Failed to add product to cart.");
                          });
                      }}>
                      Add to Cart
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-blue-600' },
              { name: 'Clothing', icon: '👕', color: 'from-purple-500 to-purple-600' },
              { name: 'Home & Garden', icon: '🏠', color: 'from-green-500 to-green-600' },
              { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-orange-600' }
            ].map((category) => (
              <div key={category.name} className="group cursor-pointer">
                <div className={`bg-gradient-to-br ${category.color} rounded-xl p-8 text-white text-center transform group-hover:scale-105 transition-all duration-300`}>
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">Get the latest deals and new arrivals delivered to your inbox</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 text-gray-900 bg-white rounded-full focus:outline-none focus:ring-4 focus:ring-white/20"
              />
              <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose ShopEase?</h2>
            <p className="text-gray-600">Trusted by thousands of happy customers worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery on orders over $50</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">30-Day Returns</h3>
              <p className="text-gray-600">Easy returns and exchanges</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is safe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-2xl font-bold">ShopEase</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Your trusted online store for quality products at unbeatable prices.
                Shop with confidence and enjoy fast, secure delivery.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.162 1.219-5.162s-.31-.62-.31-1.538c0-1.441.833-2.515 1.871-2.515.883 0 1.306.663 1.306 1.457 0 .887-.565 2.211-.856 3.434-.244 1.032.518 1.871 1.538 1.871 1.846 0 3.267-1.949 3.267-4.75 0-2.484-1.785-4.223-4.34-4.223-2.956 0-4.692 2.217-4.692 4.51 0 .893.344 1.852.775 2.374.085.103.097.194.072.299-.079.33-.254 1.037-.289 1.183-.046.191-.151.232-.35.14-1.301-.605-2.115-2.507-2.115-4.028 0-3.273 2.378-6.279 6.852-6.279 3.598 0 6.397 2.565 6.397 5.996 0 3.578-2.254 6.455-5.387 6.455-1.052 0-2.042-.547-2.38-1.193 0 0-.52 1.98-.646 2.467-.234.897-.866 2.021-1.289 2.705C9.525 23.814 10.748 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Shipping Info</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Returns</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Track Order</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Size Guide</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 ShopEase. All rights reserved. |
              <a href="/privacy" className="text-gray-300 hover:text-white ml-1">Privacy Policy</a> |
              <a href="/terms" className="text-gray-300 hover:text-white ml-1">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

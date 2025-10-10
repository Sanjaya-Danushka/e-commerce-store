import React from "react";
import "./HomePage.css";
import axios from "axios";
import { useEffect, useState } from "react";
import CustomDropdown from "../components/CustomDropdown";
import Header from "../components/Header";
import { formatMoney } from "../utils/money";
import { Link } from "react-router-dom";

const HomePage = ({ cart, wishlist, refreshCart, updateWishlist }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vipEmail, setVipEmail] = useState("");
  const [vipIsLoading, setVipIsLoading] = useState(false);

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

  const handleEmailSubscription = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/subscribe', { email });

      if (response.status === 200) {
        setEmail('');
        alert('Thank you for subscribing! You\'ll receive our latest deals and updates.');
      }
    } catch (error) {
      console.error('Subscription error:', error);

      if (error.response && error.response.data && error.response.data.error) {
        alert(`Subscription failed: ${error.response.data.error}`);
      } else {
        alert('Subscription failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVipEmailSubscription = async (e) => {
    e.preventDefault();
    if (!vipEmail || !vipEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setVipIsLoading(true);
    try {
      const response = await axios.post('/api/subscribe', { email: vipEmail });

      if (response.status === 200) {
        setVipEmail('');
        alert('Welcome to ShopEase VIP! You\'ll receive exclusive early access to sales and new arrivals.');
      }
    } catch (error) {
      console.error('VIP Subscription error:', error);

      if (error.response && error.response.data && error.response.data.error) {
        alert(`Subscription failed: ${error.response.data.error}`);
      } else {
        alert('Subscription failed. Please try again.');
      }
    } finally {
      setVipIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cart={cart} wishlist={wishlist} />

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 text-sm md:text-base">
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
              🔥 Flash Sale: Up to 70% OFF
            </span>
            <span className="hidden md:block">•</span>
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Ends in 2 hours!
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6 animate-fade-in">
              🏆 Trusted by 100,000+ Happy Customers
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              Premium Shopping
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
              Discover authentic products from top brands worldwide. Quality
              guaranteed, prices unbeatable.
            </p>

            <div className="max-w-2xl mx-auto animate-slide-up animation-delay-400">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 animate-pulse"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for brands, products, or categories..."
                    className="w-full px-8 py-5 text-gray-900 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl transform transition-all duration-300 group-hover:scale-105"
                    value={searchQuery || ""}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 animate-slide-up animation-delay-600">
              <div className="flex items-center space-x-2 text-white/80">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Free shipping over $50</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>30-day returns</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Showcase */}
      <div className="relative py-16 bg-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full translate-x-48 translate-y-48"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 text-sm font-medium mb-4">
              🏢 Premium Partnerships
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Leading Brands
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We partner with the world's most recognized brands to bring you
              authentic, quality products
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 items-center justify-items-center">
            {[
              { name: "Nike", logo: "nike", fallback: "🏃‍♂️" },
              { name: "Adidas", logo: "adidas", fallback: "⚡" },
              { name: "Apple", logo: "apple-logo", fallback: "📱" },
              { name: "Samsung", logo: "samsung", fallback: "📺" },
              { name: "Sony", logo: "sony", fallback: "🎮" },
              { name: "Dell", logo: "dell", fallback: "💻" },
            ].map((brand) => (
              <div
                key={brand.name}
                className="group cursor-pointer text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-lg relative">
                {/* Decorative background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative mb-3 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={`/images/logos/${brand.logo}.png`}
                    alt={`${brand.name} Logo`}
                    className="h-12 w-auto mx-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <div
                    className="h-12 w-12 mx-auto flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"
                    style={{ display: "none" }}>
                    {brand.fallback}
                  </div>
                </div>
                <div className="relative font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                  {brand.name}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Brand Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  500+
                </div>
                <div className="text-gray-700 font-medium">Brand Partners</div>
              </div>
            </div>
            <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  98%
                </div>
                <div className="text-gray-700 font-medium">
                  Authentic Products
                </div>
              </div>
            </div>
            <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-700 font-medium">Brand Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Products Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 text-sm font-medium mb-4">
              🔥 Limited Time Offers
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {searchQuery ? (
                <>
                  Search Results for
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    "{searchQuery}"
                  </span>
                </>
              ) : (
                <>
                  Featured
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Deals
                  </span>
                </>
              )}
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {searchQuery
                ? "Find exactly what you're looking for from our extensive collection"
                : "Don't miss out on these incredible deals - limited stock available!"}
            </p>
          </div>

          {searchQuery && (
            <div className="flex justify-center mb-8">
              <button
                onClick={() => handleSearch("")}
                className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-200 rounded-full text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Search & View All Products
              </button>
            </div>
          )}

          {products.length === 0 && searchQuery ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No products found
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                We couldn't find what you're looking for. Try adjusting your
                search terms or browse our featured products.
              </p>
              <button
                onClick={() => handleSearch("")}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Browse All Products
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="group product-card bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 transform hover:-translate-y-3 border border-gray-100 hover:border-blue-200 max-w-sm mx-auto">
                    <div className="relative aspect-[4/3] mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                      <img
                        className="product-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        src={`/${product.image}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Sale badge */}
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        SALE
                      </div>

                      {/* Favorite button */}
                      <button
                        onClick={() => {
                          const isInWishlist = wishlist.some(
                            (item) => item.productId === product.id
                          );

                          if (isInWishlist) {
                            // Remove from wishlist
                            const updatedWishlist = wishlist.filter(
                              (item) => item.productId !== product.id
                            );
                            updateWishlist(updatedWishlist);
                          } else {
                            // Add to wishlist
                            const newWishlistItem = {
                              productId: product.id,
                              dateAdded: new Date().toISOString(),
                            };
                            const updatedWishlist = [
                              ...wishlist,
                              newWishlistItem,
                            ];
                            updateWishlist(updatedWishlist);
                          }
                        }}
                        className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:scale-110 shadow-lg ${
                          wishlist.some((item) => item.productId === product.id)
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-white/90 backdrop-blur-sm hover:bg-gray-100"
                        }`}>
                        <svg
                          className={`w-6 h-6 ${
                            wishlist.some(
                              (item) => item.productId === product.id
                            )
                              ? "text-white"
                              : "text-gray-600 hover:text-red-500"
                          } transition-colors`}
                          fill={
                            wishlist.some(
                              (item) => item.productId === product.id
                            )
                              ? "currentColor"
                              : "none"
                          }
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
                    </div>

                    <div className="space-y-4">
                      <div className="product-name h-20">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                          {product.name}
                        </h3>
                      </div>

                      <div className="product-rating-container flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${
                                star <= product.rating.stars
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div className="product-rating-count text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                          ({product.rating.count})
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="product-price text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {formatMoney(product.priceCents)}
                        </div>
                        <span className="text-lg text-gray-500 line-through">
                          {formatMoney(Math.round(product.priceCents * 1.3))}
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Save {Math.round(30)}%
                        </span>
                      </div>

                      <div className="product-quantity-container">
                        <CustomDropdown
                          options={[
                            { value: 1, label: "Qty: 1" },
                            { value: 2, label: "Qty: 2" },
                            { value: 3, label: "Qty: 3" },
                            { value: 4, label: "Qty: 4" },
                            { value: 5, label: "Qty: 5" },
                            { value: 6, label: "Qty: 6" },
                            { value: 7, label: "Qty: 7" },
                            { value: 8, label: "Qty: 8" },
                            { value: 9, label: "Qty: 9" },
                            { value: 10, label: "Qty: 10" },
                          ]}
                          value={quantities[product.id] || 1}
                          onChange={(value) =>
                            handleQuantityChange(product.id, value)
                          }
                          placeholder="Select quantity"
                          className="w-full"
                        />
                      </div>

                      <div
                        className={`added-to-cart flex items-center justify-center text-green-600 text-base font-medium bg-green-50 rounded-xl py-3 transition-all duration-300 ${
                          addedToCart[product.id]
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        }`}>
                        <img
                          src="/images/icons/checkmark.png"
                          className="w-5 h-5 mr-2"
                        />
                        Added to cart!
                      </div>

                      <button
                        className="add-to-cart-button w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-base shadow-lg hover:shadow-xl transform hover:scale-105 group-hover:shadow-blue-200"
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
                        <span className="flex items-center">
                          Add to Cart
                          <svg
                            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="relative mb-16 bg-gray-50 py-16">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-3">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-transparent rounded-full translate-x-32 translate-y-32"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 text-green-700 text-sm font-medium mb-4">
                🛍️ Shop by Category
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Discover Your Perfect Match
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our handpicked collections, each curated for different
                lifestyles and preferences
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  name: "Electronics",
                  icon: "📱",
                  color: "from-blue-500 to-indigo-600",
                  description: "Latest gadgets & devices",
                  items: "2,500+ items",
                },
                {
                  name: "Fashion",
                  icon: "👕",
                  color: "from-purple-500 to-pink-600",
                  description: "Trendy clothing & accessories",
                  items: "5,200+ items",
                },
                {
                  name: "Home & Garden",
                  icon: "🏠",
                  color: "from-green-500 to-emerald-600",
                  description: "Everything for your space",
                  items: "1,800+ items",
                },
                {
                  name: "Sports",
                  icon: "⚽",
                  color: "from-orange-500 to-red-600",
                  description: "Gear up for action",
                  items: "3,100+ items",
                },
              ].map((category, index) => (
                <div
                  key={category.name}
                  className="group cursor-pointer animate-slide-up relative"
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <div
                    className={`relative bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white text-center transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-500 shadow-lg group-hover:shadow-2xl overflow-hidden h-56`}>
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-white/20 transform rotate-12 scale-150"></div>
                    </div>

                    {/* Floating decorative elements */}
                    <div className="absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/10 rounded-full animate-pulse animation-delay-1000"></div>

                    <div className="relative h-full flex flex-col justify-between">
                      <div>
                        <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-200 transition-colors duration-300">
                          {category.name}
                        </h3>
                      </div>

                      <div className="text-center">
                        <p className="text-sm opacity-90 mb-2">
                          {category.description}
                        </p>
                        <div className="text-xs opacity-80 font-medium bg-white/20 rounded-full px-3 py-1 inline-block">
                          {category.items}
                        </div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 rounded-3xl p-8 md:p-16 text-white mb-16 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12 animate-pulse animation-delay-2000"></div>
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
              📧 Get VIP Access
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
              Never Miss a Deal
            </h2>

            <p className="text-xl mb-10 opacity-90 animate-slide-up animation-delay-200 max-w-3xl mx-auto">
              Join 100,000+ smart shoppers who get exclusive early access to
              sales, new arrivals, and VIP-only discounts
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto animate-slide-up animation-delay-400 mb-8">
              <div className="relative flex-1 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 animate-pulse"></div>
                <input
                  type="email"
                  placeholder="Enter your email for VIP access"
                  value={vipEmail}
                  onChange={(e) => setVipEmail(e.target.value)}
                  className="relative w-full px-6 py-4 text-gray-900 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl transform transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <button
                onClick={handleVipEmailSubscription}
                disabled={vipIsLoading}
                className={`relative bg-white text-indigo-600 font-bold py-4 px-8 rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group overflow-hidden ${
                  vipIsLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                <span className="relative z-10 flex items-center">
                  {vipIsLoading ? 'Joining...' : 'Get VIP Access'}
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up animation-delay-600">
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Early sale access</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Exclusive discounts</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white/90">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">New arrival alerts</span>
              </div>
            </div>

            <p className="text-sm opacity-75 mt-6 animate-slide-up animation-delay-600">
              Join free in 30 seconds • Unsubscribe anytime • We respect your
              privacy
            </p>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="relative mb-16 bg-white py-16">
          {/* Subtle decorative elements */}
          <div className="absolute inset-0 opacity-2">
            <div className="absolute top-1/4 left-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -translate-x-16"></div>
            <div className="absolute bottom-1/4 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full translate-x-16"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-700 text-sm font-medium mb-4">
                💬 Customer Love
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it - hear from our satisfied
                customers who trust us with their shopping
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Verified Buyer",
                  rating: 5,
                  text: "Amazing quality and fast delivery! The customer service is top-notch. Will definitely shop here again.",
                  avatar: "SJ",
                },
                {
                  name: "Michael Chen",
                  role: "Verified Buyer",
                  rating: 5,
                  text: "Best online shopping experience I've had. Genuine products, great prices, and excellent support team.",
                  avatar: "MC",
                },
                {
                  name: "Emily Rodriguez",
                  role: "Verified Buyer",
                  rating: 5,
                  text: "Love the variety and quality. The sale prices are unbeatable. Highly recommend this store!",
                  avatar: "ER",
                },
              ].map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className={`relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-slide-up`}
                  style={{ animationDelay: `${index * 0.2}s` }}>
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full"></div>

                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current mr-1"
                          viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed text-lg">
                      "{testimonial.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg p-8 mb-16 border border-gray-100">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse">
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-4">
              🛡️ Your trusted partner
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
              Why Choose ShopEase?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-200">
              Join thousands of satisfied customers who trust us for quality,
              reliability, and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "M5 13l4 4L19 7",
                title: "Free Shipping",
                description:
                  "Free delivery on orders over $50 with fast, tracked shipping",
                color: "green",
              },
              {
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "30-Day Returns",
                description:
                  "Easy returns and exchanges with our hassle-free policy",
                color: "blue",
              },
              {
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                title: "Secure Payment",
                description:
                  "Your payment information is protected with industry-leading security",
                color: "purple",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`group text-center p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg animate-slide-up`}
                style={{ animationDelay: `${index * 0.2}s` }}>
                <div
                  className={`w-20 h-20 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <svg
                    className={`w-10 h-10 text-${feature.color}-600`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats section */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "50K+", label: "Happy Customers" },
                { number: "99.9%", label: "Satisfaction Rate" },
                { number: "24/7", label: "Customer Support" },
                { number: "30", label: "Day Returns" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">ShopEase</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted online marketplace for premium products from top
                brands worldwide. Quality guaranteed, prices unbeatable.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.219-.438-.219-1.085c0-1.016.673-1.774 1.508-1.774.711 0 1.055.533 1.055 1.174 0 .713-.454 1.778-.689 2.765-.196.828.414 1.503 1.229 1.503 1.474 0 2.608-1.554 2.608-3.804 0-1.99-1.430-3.382-3.472-3.382-2.365 0-3.756 1.774-3.756 3.61 0 .713.275 1.479.618 1.898.068.082.077.154.057.239-.061.257-.196.796-.223.907-.035.146-.116.177-.268.107-1.001-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.287-4.84 2.781 0 4.943 1.982 4.943 4.628 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A12.013 12.013 0 0 0 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">
                Customer Service
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors">
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors">
                    Track Order
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors">
                    Gift Cards
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/press"
                    className="text-gray-400 hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/affiliate-program"
                    className="text-gray-400 hover:text-white transition-colors">
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wholesale"
                    className="text-gray-400 hover:text-white transition-colors">
                    Wholesale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">
                Stay Connected
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Get exclusive deals and early access to new products.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleEmailSubscription}
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-md transition-colors ${
                    isLoading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  📧 support@shopease.com
                  <br />
                  📞 1-800-SHOP-NOW
                  <br />
                  📍 123 Commerce St, NY 10001
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods & Bottom Bar */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">We Accept:</span>
                <div className="flex space-x-2">
                  <div className="bg-gray-700 rounded px-2 py-1 text-xs text-gray-300">
                    VISA
                  </div>
                  <div className="bg-gray-700 rounded px-2 py-1 text-xs text-gray-300">
                    MC
                  </div>
                  <div className="bg-gray-700 rounded px-2 py-1 text-xs text-gray-300">
                    AMEX
                  </div>
                  <div className="bg-gray-700 rounded px-2 py-1 text-xs text-gray-300">
                    PP
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">
                  © 2024 ShopEase. All rights reserved. |
                  <Link
                    to="/privacy"
                    className="text-gray-300 hover:text-white ml-1 transition-colors">
                    Privacy Policy
                  </Link>{" "}
                  |
                  <Link
                    to="/terms-of-service"
                    className="text-gray-300 hover:text-white ml-1 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  |
                  <Link
                    to="/accessibility"
                    className="text-gray-300 hover:text-white ml-1 transition-colors">
                    Accessibility
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

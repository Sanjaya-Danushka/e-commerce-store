import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomDropdown from "../components/CustomDropdown";
import { formatMoney } from "../utils/money";
import axios from "axios";

const ProductsPage = ({ cart, wishlist, refreshCart, updateWishlist }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [freeShipping, setFreeShipping] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        const productsData = response.data;
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Initialize quantities
        const initialQuantities = {};
        productsData.forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);

        // Set max price for filter
        if (productsData.length > 0) {
          const maxPrice = Math.max(...productsData.map(p => p.priceCents));
          setPriceRange(prev => ({ ...prev, max: Math.ceil(maxPrice / 100) * 100 }));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.priceCents >= priceRange.min * 100 &&
      product.priceCents <= priceRange.max * 100
    );

    // Free shipping filter (assuming products with price > $50 have free shipping)
    if (freeShipping) {
      filtered = filtered.filter(product => product.priceCents >= 5000);
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(product => product.rating.stars >= minRating);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.priceCents - b.priceCents;
        case "price-high":
          return b.priceCents - a.priceCents;
        case "rating":
          return b.rating.stars - a.rating.stars;
        case "newest":
          return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, priceRange, freeShipping, minRating, sortBy]);

  const categories = [
    { id: "all", name: "All Categories", icon: "📦" },
    { id: "electronics", name: "Electronics", icon: "📱" },
    { id: "fashion", name: "Fashion", icon: "👕" },
    { id: "home", name: "Home & Garden", icon: "🏠" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "books", name: "Books", icon: "📚" },
  ];

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(quantity),
    });
  };

  const handleAddToCart = async (product) => {
    try {
      await axios.post("/api/cart-items", {
        productId: product.id,
        quantity: quantities[product.id] || 1,
      });

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

      if (refreshCart) refreshCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleWishlistToggle = (product) => {
    const isInWishlist = wishlist.some(item => item.productId === product.id);

    if (isInWishlist) {
      const updatedWishlist = wishlist.filter(item => item.productId !== product.id);
      updateWishlist(updatedWishlist);
    } else {
      const newWishlistItem = {
        productId: product.id,
        dateAdded: new Date().toISOString()
      };
      const updatedWishlist = [...wishlist, newWishlistItem];
      updateWishlist(updatedWishlist);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header cart={cart} wishlist={wishlist} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header cart={cart} wishlist={wishlist} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/banners/products-hero-banner.jpg"
            alt="Premium Products Collection"
            className="w-full h-full object-cover opacity-20 mix-blend-multiply"
          />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6 animate-fade-in">
              🛍️ Premium Collection
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              All Products
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Collection
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
              Discover our complete collection of premium products from top brands worldwide
            </p>

            <div className="max-w-2xl mx-auto animate-slide-up animation-delay-400">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 animate-pulse"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for brands, products, or categories..."
                    className="w-full px-8 py-5 text-gray-900 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl transform transition-all duration-300 group-hover:scale-105"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Category Navigation Cards - Hide when searching */}
      {!searchQuery && (
        <div className="relative py-16 bg-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full translate-x-48 translate-y-48"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 text-green-700 text-sm font-medium mb-4">
                🛍️ Shop by Category
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
                Find What You're Looking For
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-200">
                Browse our extensive collection organized by categories
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group cursor-pointer animate-slide-up relative p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-gray-50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-indigo-100'
                  }`}>
                    {category.icon}
                  </div>
                  <h3 className={`text-center font-semibold transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'text-blue-600'
                      : 'text-gray-900 group-hover:text-blue-600'
                  }`}>
                    {category.name}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 animate-slide-up">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters & Search
              </h3>

              {/* Search in sidebar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-blue-300 transition-all duration-200"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">📂 Categories</h4>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500 focus:ring-2 w-4 h-4"
                      />
                      <span className="text-gray-700 font-medium">{category.icon} {category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">💰 Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                        className="w-full pl-8 pr-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-blue-300 transition-all duration-200"
                      />
                    </div>
                    <span className="text-gray-500 font-medium">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 10000 }))}
                        className="w-full pl-8 pr-3 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-blue-300 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    Current range: ${priceRange.min} - ${priceRange.max}
                  </div>
                </div>
              </div>

              {/* Free Shipping */}
              <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={freeShipping}
                    onChange={(e) => setFreeShipping(e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded w-5 h-5"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 font-medium">🚚 Free Shipping</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">(Orders over $50)</span>
                  </div>
                </label>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">⭐ Minimum Rating</h4>
                <CustomDropdown
                  options={[
                    { value: 0, label: "⭐ Any Rating" },
                    { value: 3, label: "⭐⭐⭐ 3+ Stars" },
                    { value: 4, label: "⭐⭐⭐⭐ 4+ Stars" },
                    { value: 5, label: "⭐⭐⭐⭐⭐ 5 Stars Only" }
                  ]}
                  value={minRating}
                  onChange={setMinRating}
                  placeholder="Select minimum rating"
                />
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange({ min: 0, max: 10000 });
                  setFreeShipping(false);
                  setMinRating(0);
                  setSortBy("name");
                }}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🗑️ Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 animate-fade-in">
              <div className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>

              <div className="flex items-center space-x-3">
                <label className="text-gray-700 font-medium">Sort by:</label>
                <CustomDropdown
                  options={[
                    { value: "name", label: "📝 Name (A-Z)" },
                    { value: "price-low", label: "💰 Price (Low to High)" },
                    { value: "price-high", label: "💎 Price (High to Low)" },
                    { value: "rating", label: "⭐ Highest Rated" },
                    { value: "newest", label: "🆕 Newest First" }
                  ]}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort products"
                  className="min-w-[200px]"
                />
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange({ min: 0, max: 10000 });
                    setFreeShipping(false);
                    setMinRating(0);
                  }}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Clear Filters
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group product-card bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 transform hover:-translate-y-3 border border-gray-100 hover:border-blue-200 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative aspect-[4/3] mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                      <img
                        className="product-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        src={`/${product.image}`}
                        alt={product.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Free Shipping Badge */}
                      {product.priceCents >= 5000 && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          FREE SHIPPING
                        </div>
                      )}

                      {/* Wishlist Heart */}
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:scale-110 shadow-lg ${
                          wishlist.some(item => item.productId === product.id)
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-white/90 backdrop-blur-sm hover:bg-gray-100"
                        }`}>
                        <svg
                          className={`w-6 h-6 ${
                            wishlist.some(item => item.productId === product.id)
                              ? "text-white"
                              : "text-gray-600 hover:text-red-500"
                          } transition-colors`}
                          fill={
                            wishlist.some(item => item.productId === product.id)
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
                      <div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                          {categories.find(cat => cat.id === product.category)?.name || product.category}
                        </span>
                      </div>

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

                      <div className="product-price text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {formatMoney(product.priceCents)}
                      </div>

                      {/* Quantity Selector */}
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
                            { value: 10, label: "Qty: 10" }
                          ]}
                          value={quantities[product.id] || 1}
                          onChange={(value) => handleQuantityChange(product.id, value)}
                          placeholder="Select quantity"
                          className="w-full"
                        />
                      </div>

                      {/* Success message */}
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
                        onClick={() => handleAddToCart(product)}>
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="relative py-16 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-200 to-blue-200 rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full translate-x-48 translate-y-48"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 text-green-700 text-sm font-medium mb-4">
              🛡️ Why Choose Us
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up">
              Trusted Shopping Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-200">
              Shop with confidence knowing you're getting the best products and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🚚",
                title: "Free Shipping",
                description: "Free delivery on orders over $50",
                color: "from-blue-500 to-indigo-600"
              },
              {
                icon: "↩️",
                title: "30-Day Returns",
                description: "Easy returns within 30 days",
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: "💬",
                title: "24/7 Support",
                description: "Round-the-clock customer service",
                color: "from-purple-500 to-pink-600"
              },
              {
                icon: "🔒",
                title: "Secure Payment",
                description: "100% secure checkout process",
                color: "from-orange-500 to-red-600"
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
            📧 Stay Updated
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
            Never Miss a
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Great Deal
            </span>
          </h2>

          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Get exclusive access to new products, special offers, and early sale notifications
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto animate-slide-up animation-delay-400">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 text-gray-900 bg-white rounded-full focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
            />
            <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Subscribe Now
            </button>
          </div>

          <p className="text-sm opacity-75 mt-6 animate-slide-up animation-delay-600">
            Join 50,000+ happy customers • Unsubscribe anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  );
};

export default ProductsPage;

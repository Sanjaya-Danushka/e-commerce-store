import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import CustomDropdown from "../components/CustomDropdown";
import { formatMoney } from "../utils/money";
import axios from "axios";

const ProductsPage = ({ cart, wishlist, refreshCart, refreshWishlist, updateWishlist }) => {
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
      <div className="min-h-screen bg-gray-50">
        <Header cart={cart} wishlist={wishlist} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cart={cart} wishlist={wishlist} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">All Products</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Discover our complete collection of premium products
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 animate-pulse"></div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-8 py-4 text-gray-900 bg-white rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl transform transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Filters</h3>

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
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Minimum Rating</h4>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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
              <div className="text-center py-20">
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
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group product-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200">
                    <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        className="product-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        src={`/${product.image}`}
                        alt={product.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Free Shipping Badge */}
                      {product.priceCents >= 5000 && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          FREE SHIPPING
                        </div>
                      )}

                      {/* Wishlist Heart */}
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          wishlist.some(item => item.productId === product.id)
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-white/90 backdrop-blur-sm hover:bg-gray-100 text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill={wishlist.some(item => item.productId === product.id) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                          {categories.find(cat => cat.id === product.category)?.name || product.category}
                        </span>
                      </div>

                      <div className="product-name h-16">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                          {product.name}
                        </h3>
                      </div>

                      <div className="product-rating-container flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= product.rating.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div className="product-rating-count text-green-600 text-sm font-medium">
                          ({product.rating.count})
                        </div>
                      </div>

                      <div className="product-price text-2xl font-bold text-gray-900">
                        {formatMoney(product.priceCents)}
                      </div>

                      {/* Quantity Selector */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
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
                        className={`mb-3 flex items-center justify-center text-green-600 text-sm font-medium bg-green-50 rounded-lg py-2 transition-all duration-300 ${
                          addedToCart[product.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Added to cart!
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addedToCart[product.id]}
                        className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105 ${
                          addedToCart[product.id]
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                        }`}
                      >
                        {addedToCart[product.id] ? (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Added!
                          </>
                        ) : (
                          <>
                            Add to Cart
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

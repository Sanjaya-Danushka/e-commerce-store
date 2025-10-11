import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomDropdown from '../components/CustomDropdown';
import { formatMoney } from '../utils/money';
import axios from 'axios';

const imageCategories = {
  'hero-mega-sale-banner.jpg': 'promotional',
  'electronics-flash-sale.jpg': 'electronics',
  'fashion-70-off.jpg': 'fashion',
  'home-decor-sale.jpg': 'home',
  'sports-equipment-sale.jpg': 'sports',
  'hero-seasonal-sale-banner.jpg': 'seasonal'
};

const NewArrivalsPage = ({ cart, refreshCart }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [allNewArrivals, setAllNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch('/api/products');
        const products = await response.json();

        // Enhance products with our new images from newPage-images directory
        const enhancedProducts = products.map((product, index) => ({
          ...product,
          newArrivalImage: `/images/newPage-images/${Object.keys(imageCategories)[index % Object.keys(imageCategories).length]}`
        }));

        setNewArrivals(enhancedProducts);
        setAllNewArrivals(enhancedProducts);

        // Initialize quantities to 1 for each product
        const initialQuantities = {};
        enhancedProducts.forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setNewArrivals([]);
        setAllNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setNewArrivals(allNewArrivals);
    } else {
      const filtered = allNewArrivals.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setNewArrivals(filtered);
    }
  }, [searchQuery, allNewArrivals]);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(quantity),
    });
  };

  const toggleWishlist = async (productId) => {
    try {
      const isInWishlist = wishlistItems.has(productId);

      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`/api/wishlist/${productId}`);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        // Add to wishlist
        await axios.post('/api/wishlist', { productId });
        setWishlistItems(prev => new Set(prev).add(productId));
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header cart={cart} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-600 text-lg font-medium">Loading amazing new arrivals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header cart={cart} />

      {/* Enhanced Hero Section */}
      <div className="relative py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full animate-pulse animation-delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8 animate-slide-up">
              🆕 Fresh Arrivals Daily
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up animation-delay-200">
              New Arrivals
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-pulse">
                Collection
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto animate-slide-up animation-delay-400">
              Discover the latest trends and newest products. Be the first to own what's hot and trending!
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto animate-slide-up animation-delay-600">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search new arrivals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-20 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/20 focus:border-white/40 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-gray-700">
              <span className="font-medium">Search results for </span>
              <span className="font-bold text-green-600">"{searchQuery}"</span>
              <span className="ml-2">({newArrivals.length} new arrivals found)</span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded-full text-green-700 text-sm transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}

      {/* Featured Categories Section */}
      {!searchQuery && (
        <div className="relative py-20 bg-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full translate-x-48 translate-y-48"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-sm font-medium mb-4 animate-slide-up">
                🛍️ Shop by Category
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up animation-delay-200">
                New Arrivals by Category
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-400">
                Explore our newest products organized by your favorite categories
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  name: "Electronics",
                  icon: "📱",
                  color: "from-blue-500 to-indigo-600",
                  newItems: "12+ new",
                  image: "/images/newPage-images/electronics-flash-sale.jpg"
                },
                {
                  name: "Fashion",
                  icon: "👕",
                  color: "from-purple-500 to-pink-600",
                  newItems: "18+ new",
                  image: "/images/newPage-images/fashion-70-off.jpg"
                },
                {
                  name: "Home",
                  icon: "🏠",
                  color: "from-green-500 to-emerald-600",
                  newItems: "8+ new",
                  image: "/images/newPage-images/home-decor-sale.jpg"
                },
                {
                  name: "Sports",
                  icon: "⚽",
                  color: "from-orange-500 to-red-600",
                  newItems: "15+ new",
                  image: "/images/newPage-images/ports-equipment-sale.jpg"
                }
              ].map((category, index) => (
                <div
                  key={category.name}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:-translate-y-2 border border-gray-100 hover:border-green-200 animate-slide-up relative overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={`${category.name} Category`}
                      className="w-full h-full object-cover opacity-10 mix-blend-multiply"
                    />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500/20 rounded-full animate-pulse"></div>

                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
                      {category.name}
                    </h3>

                    <div className="text-sm text-green-600 font-medium">{category.newItems}</div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced New Arrivals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-sm font-medium mb-4 animate-slide-up">
            🆕 Latest Products
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up animation-delay-200">
            Fresh Arrivals This Week
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up animation-delay-400">
            Check out what's new in our catalog - updated daily with the latest trends and innovations
          </p>
        </div>

        {newArrivals.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No new arrivals found</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {searchQuery ? "Try adjusting your search terms to find more products." : "We're working on bringing you the latest products. Check back soon!"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                View All New Arrivals
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-5 transform hover:-translate-y-3 border border-gray-100 hover:border-green-200 animate-slide-up relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 transform rotate-12 scale-150"></div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500/10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 bg-emerald-500/10 rounded-full animate-pulse animation-delay-1000"></div>

                <div className="relative">
                  <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                    <img
                      className="product-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      src={`/${product.image}`}
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Enhanced NEW badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      ✨ NEW
                    </div>

                    {/* Favorite button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:scale-110 shadow-lg ${
                        wishlistItems.has(product.id) ? 'bg-red-100' : ''
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 transition-colors duration-200 ${
                          wishlistItems.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-green-500'
                        }`}
                        fill={wishlistItems.has(product.id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 mb-3">
                        🆕 New Arrival
                      </span>
                    </div>

                    <div className="product-name h-16">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-3 group-hover:text-green-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                    </div>

                    {/* Enhanced rating */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">(4.8)</span>
                    </div>

                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
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
                          { value: 5, label: "Qty: 5" }
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
                        addedToCart[product.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Added to cart!
                    </div>

                    <button
                      className="add-to-cart-button w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
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

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Newsletter Section */}
        <div className="mt-20 relative bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 rounded-3xl p-12 text-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/images/newPage-images/hero-mega-sale-banner.jpg"
              alt="Newsletter Background"
              className="w-full h-full object-cover opacity-20"
            />
          </div>

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-green-900/80 to-emerald-900/80"></div>

          <div className="relative text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-4">
              📧 Stay Updated
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Never Miss
              <span className="block bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                New Arrivals
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get instant notifications when we add new products. Be the first to know about exclusive launches and limited editions.
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20"
                />
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Get Notified
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-4">Join 50,000+ subscribers. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewArrivalsPage;

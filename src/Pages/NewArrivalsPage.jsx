import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomDropdown from '../components/CustomDropdown';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const imageCategories = {
  'hero-mega-sale-banner.jpg': 'promotional',
  'electronics-flash-sale.jpg': 'electronics',
  'fashion-70-off.jpg': 'fashion',
  'home-decor-sale.jpg': 'home',
  'sports-equipment-sale.jpg': 'sports',
  'hero-seasonal-sale-banner.jpg': 'seasonal'
};

const NewArrivalsPage = ({ cart, wishlist, refreshCart, updateWishlist }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [allNewArrivals, setAllNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);
  const [isNewsletterSubscribing, setIsNewsletterSubscribing] = useState(false);

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

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();

    if (!newsletterEmail.trim()) {
      alert("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsNewsletterSubscribing(true);

    try {
      console.log("New Arrivals newsletter subscription:", newsletterEmail);

      const response = await axios.post("/api/subscribe", { email: newsletterEmail });

      console.log("New Arrivals newsletter subscription successful:", response.data);

      setIsNewsletterSubscribed(true);
      setNewsletterEmail("");

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsNewsletterSubscribed(false);
      }, 3000);

    } catch (error) {
      console.error("New Arrivals newsletter subscription error:", error);

      if (error.code === 'ECONNABORTED') {
        alert("Request timed out. Please check if your backend server is running.");
      } else if (error.response) {
        const errorMessage = error.response.data?.message ||
                           error.response.data?.error ||
                           `Server error (${error.response.status})`;
        alert(`Subscription failed: ${errorMessage}`);
      } else if (error.request) {
        alert("Network error. Please check your internet connection and backend server.");
      } else {
        alert("Failed to subscribe. Please try again or check the console for details.");
      }
    } finally {
      setIsNewsletterSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Header cart={cart} wishlist={wishlist} />
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
      <Header cart={cart} wishlist={wishlist} />

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
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlist={wishlist}
                refreshCart={refreshCart}
                updateWishlist={updateWishlist}
                showAddToCart={true}
                showWishlist={true}
              />
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
              <form onSubmit={handleNewsletterSubscribe}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={isNewsletterSubscribed || isNewsletterSubscribing}
                    className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isNewsletterSubscribed || isNewsletterSubscribing || !newsletterEmail.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isNewsletterSubscribing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subscribing...
                      </div>
                    ) : isNewsletterSubscribed ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Subscribed!
                      </div>
                    ) : (
                      "Get Notified"
                    )}
                  </button>
                </div>
              </form>
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

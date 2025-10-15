import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router";
import CustomDropdown from "../components/CustomDropdown";

const SalePage = ({ cart, wishlist, refreshCart, updateWishlist }) => {
  const [saleProducts, setSaleProducts] = useState([]);
  const [allSaleProducts, setAllSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        console.log('🔄 Fetching sale products from API...');
        const response = await fetch("/api/products");
        const productsData = await response.json();

        // Extract products array from API response
        // API returns: { products: [...], pagination: {...} }
        const productsArray = Array.isArray(productsData) ? productsData : productsData.products || [];

        console.log(`✅ Sale products loaded: ${productsArray.length} products`);

        // For demo purposes, we'll take all products and mark them as sale products
        setSaleProducts(productsArray);
        setAllSaleProducts(productsArray);
      } catch (error) {
        console.error("Error fetching sale products:", error);
        setSaleProducts([]);
        setAllSaleProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === "") {
      setSaleProducts(allSaleProducts);
    } else {
      const filtered = allSaleProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSaleProducts(filtered);
    }
  }, [searchQuery, allSaleProducts]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cart={cart} wishlist={wishlist} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sale products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
      <div className="relative bg-gradient-to-br from-red-600 via-pink-600 to-orange-600 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/banners/sales-banners/hero-mega-sale-banner.jpg"
            alt="Mega Sale Banner"
            className="w-full h-full object-cover opacity-20 mix-blend-multiply"
          />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6 animate-fade-in">
              🔥 MEGA SALE EVENT
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              Up to
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                70% OFF
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
              Don't miss our biggest sale of the year! Limited time offers on
              thousands of premium products from top brands worldwide.
            </p>

            <div className="max-w-2xl mx-auto animate-slide-up animation-delay-400">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full blur opacity-75 group-hover:opacity-100 animate-pulse"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for sale items..."
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

      {/* Sale Categories - Hide when searching */}
      {!searchQuery && (
        <div className="relative py-16 bg-gray-50 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-200 to-pink-200 rounded-full -translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full translate-x-48 translate-y-48"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 text-sm font-medium mb-4 animate-slide-up">
                🛍️ Sale Categories
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up animation-delay-200">
                Shop Our Biggest Discounts
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up animation-delay-400">
                Explore incredible savings across all categories - limited time
                offers you can't miss!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                {
                  name: "Electronics Sale",
                  discount: "60% OFF",
                  items: "500+ deals",
                  color: "from-blue-500 to-indigo-600",
                  icon: "📱",
                  bgImage:
                    "/images/banners/sales-banners/electronics-flash-sale.jpg",
                },
                {
                  name: "Fashion Sale",
                  discount: "70% OFF",
                  items: "800+ deals",
                  color: "from-purple-500 to-pink-600",
                  icon: "👕",
                  bgImage: "/images/banners/sales-banners/fashion-70-off.jpg",
                },
                {
                  name: "Home Sale",
                  discount: "50% OFF",
                  items: "300+ deals",
                  color: "from-green-500 to-emerald-600",
                  icon: "🏠",
                  bgImage: "/images/banners/sales-banners/home-decor-sale.jpg",
                },
                {
                  name: "Sports Sale",
                  discount: "55% OFF",
                  items: "400+ deals",
                  color: "from-orange-500 to-red-600",
                  icon: "⚽",
                  bgImage: "/images/banners/sales-banners/bestseller-deals.jpg",
                },
              ].map((sale, index) => (
                <Link
                  key={sale.name}
                  to={`/sale/${sale.name.toLowerCase().replace(" ", "-")}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:-translate-y-2 border border-gray-100 hover:border-red-200 animate-slide-up relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={sale.bgImage}
                      alt={`${sale.name} Banner`}
                      className="w-full h-full object-cover opacity-10 mix-blend-multiply"
                    />
                  </div>

                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-white/20 transform rotate-12 scale-150"></div>
                  </div>

                  {/* Floating decorative elements */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 bg-white/10 rounded-full animate-pulse animation-delay-1000"></div>

                  <div className="relative">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${sale.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{sale.icon}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200">
                      {sale.name}
                    </h3>

                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {sale.discount}
                    </div>
                    <div className="text-sm text-gray-600">{sale.items}</div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Sale Items */}
      <div className="w-full px-2 sm:px-4 lg:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 text-sm font-medium mb-4 animate-slide-up">
              🔥 Featured Sale Items
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-up animation-delay-200">
              Hand-picked deals you don't want to miss
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-slide-up animation-delay-400">
              Discover amazing products at unbeatable prices - limited stock
              available!
            </p>
          </div>

          {searchQuery && (
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 text-sm font-medium">
                  Search Results for "{searchQuery}"
                </div>
                <button
                  onClick={() => handleSearch("")}
                  className="ml-4 inline-flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 text-sm transition-colors">
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {saleProducts.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-red-400"
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
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No products found
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                We couldn't find any products matching your search. Try
                adjusting your search terms or browse all our sale items.
              </p>
              <button
                onClick={() => handleSearch("")}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                View All Sale Items
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {saleProducts.map((product) => (
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
        </div>
      </div>

      {/* Customer Testimonials Section */}
      <div className="relative py-20 bg-gray-900 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/banners/customer-testimonials-bg.jpg"
            alt="Happy Customers"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gray-900/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-4">
              ⭐ Customer Love
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Customers
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Are Saying
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust us for their
              shopping needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Verified Buyer",
                content:
                  "Absolutely love the quality and fast shipping! The customer service team went above and beyond to help me find the perfect gift.",
                rating: 5,
                avatar: "SJ",
              },
              {
                name: "Michael Chen",
                role: "Tech Enthusiast",
                content:
                  "Best online shopping experience I've had. Authentic products, great prices, and the return process is super easy.",
                rating: 5,
                avatar: "MC",
              },
              {
                name: "Emily Rodriguez",
                role: "Fashion Lover",
                content:
                  "The fashion collection is amazing! I always find unique pieces that match my style. Highly recommend this store!",
                rating: 5,
                avatar: "ER",
              },
            ].map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-200 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-green-400 text-sm font-medium">
                    ✓ Verified Purchase
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                50K+
              </div>
              <div className="text-gray-300 text-sm">Happy Customers</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-green-400 mb-2">4.9★</div>
              <div className="text-gray-300 text-sm">Average Rating</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-red-400 mb-2">99%</div>
              <div className="text-gray-300 text-sm">Satisfaction Rate</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-pink-400 mb-2">24/7</div>
              <div className="text-gray-300 text-sm">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SalePage;

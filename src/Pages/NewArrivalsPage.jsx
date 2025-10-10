import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router";
import { formatMoney } from "../utils/money";
import axios from "axios";
import CustomDropdown from "../components/CustomDropdown";

const NewArrivalsPage = ({ cart, refreshCart }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        // For new arrivals, we'll get all products and filter for newest ones
        // You can modify this endpoint to specifically get new arrivals from your backend
        const response = await fetch('/api/products');
        const products = await response.json();

        // For demo purposes, we'll take the first 6 products as "new arrivals"
        // In a real app, you'd have a specific endpoint for new arrivals
        setNewArrivals(products.slice(0, 6));
        // Initialize quantities to 1 for each product
        const initialQuantities = {};
        products.slice(0, 6).forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        // Fallback to empty array
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(quantity),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cart={cart} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading new arrivals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cart={cart} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            🆕 Fresh Arrivals
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            New Arrivals
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Be the first to discover our latest products. Fresh inventory updated weekly!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-white/90">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-lg font-semibold">Updated Daily</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Arrivals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🆕 Latest Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Check out what's new in our catalog this week</p>
        </div>

        {newArrivals.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No new arrivals yet</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              We're working on bringing you the latest products. Check back soon for new arrivals!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 transform hover:-translate-y-2 border border-gray-100 hover:border-green-200">
                <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    className="product-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    src={`/${product.image}`}
                    alt={product.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* NEW badge */}
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    NEW
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      New Arrival
                    </span>
                  </div>

                  <div className="product-name h-16">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
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

                  <div className="product-price text-xl font-bold text-green-600">
                    {formatMoney(product.priceCents)}
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-3">
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
                    className={`mb-3 flex items-center justify-center text-green-600 text-sm font-medium bg-green-50 rounded-lg py-2 transition-all duration-300 ${
                      addedToCart[product.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to cart!
                  </div>

                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss New Arrivals</h2>
          <p className="text-lg mb-6 opacity-90">Get notified when we add new products to our catalog</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-gray-900 bg-white rounded-full focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button className="bg-white text-green-600 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-200">
              Notify Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import OrderContainer from "../components/OrderContainer";
import { useAuth } from "../contexts/AuthContext";

const OrdersPage = ({ cart, refreshCart }) => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Add cache-busting timestamp to ensure fresh data
      const response = await axios.get(`/api/orders?expand=products&_t=${Date.now()}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Refresh orders when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, refreshing orders for:', user.email);
      fetchOrders();
    }
  }, [isAuthenticated, user]);

  // Add periodic refresh to catch status updates from admin panel
  useEffect(() => {
    if (isAuthenticated && user) {
      const interval = setInterval(() => {
        // Add cache-busting timestamp for fresh data
        axios.get(`/api/orders?expand=products&_t=${Date.now()}`)
          .then(response => {
            setOrders(response.data);
          })
          .catch(error => {
            console.error("Error refreshing orders:", error);
          });
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const handleAddToCart = (productId) => {
    axios
      .post("/api/cart-items", {
        productId: productId,
        quantity: 1,
      })
      .then(() => {
        refreshCart();
        alert("Product added to cart!");
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("Failed to add product to cart.");
      });
  };

  return (
    <div>
      <title>Orders</title>
      <Header cart={cart} />

      {/* Orders Page Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden mb-8">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 mx-auto animate-fade-in">
              <svg
                className="w-10 h-10 text-white"
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
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
              Your Orders
            </h1>

            <p className="text-xl opacity-90 max-w-2xl mx-auto animate-slide-up animation-delay-200">
              Track your purchases, view order details, and manage your shopping history
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              refreshing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {refreshing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No orders yet
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {isAuthenticated ? "You haven't placed any orders yet. Start shopping to see your orders here." : "Please log in to view your orders."}
              </p>
              {!isAuthenticated ? (
                <a
                  href="/login"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Sign In to View Orders
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
                </a>
              ) : (
                <a
                  href="/"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Start Shopping
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
                </a>
              )}
            </div>
          ) : (
            orders.map((order) => (
              <OrderContainer
                key={order.id}
                order={order}
                onAddToCart={handleAddToCart}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

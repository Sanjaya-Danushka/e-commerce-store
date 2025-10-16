import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import OrderContainer from "../components/OrderContainer";
import { useAuth } from "../contexts/AuthContext";

const OrdersPage = ({ cart, refreshCart }) => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const previousOrdersRef = useRef([]);
  const [notifications, setNotifications] = useState([]);
  const showNotification = useCallback((message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  }, []);

  const fetchOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      // Add cache-busting timestamp to ensure fresh data
      const response = await axios.get(`/api/orders?expand=products&_t=${Date.now()}`);
      const newOrders = response.data;

      // Check if any order statuses have changed
      if (previousOrdersRef.current.length > 0 && newOrders.length > 0) {
        const statusChanged = newOrders.some((newOrder, index) => {
          const prevOrder = previousOrdersRef.current[index];
          return prevOrder && prevOrder.status !== newOrder.status;
        });

        if (statusChanged) {
          console.log('Order status changed, updating display');

          // Find which orders changed and show notifications
          newOrders.forEach((newOrder, index) => {
            const prevOrder = previousOrdersRef.current[index];
            if (prevOrder && prevOrder.status !== newOrder.status) {
              let message = '';
              switch (newOrder.status) {
                case 'processing':
                  message = `Order #${newOrder.id.slice(-8)} is now being processed!`;
                  break;
                case 'shipped':
                  message = `Order #${newOrder.id.slice(-8)} has been shipped! 📦`;
                  break;
                case 'delivered':
                  message = `Order #${newOrder.id.slice(-8)} has been delivered! ✅`;
                  break;
                case 'cancelled':
                  message = `Order #${newOrder.id.slice(-8)} has been cancelled.`;
                  break;
                default:
                  message = `Order #${newOrder.id.slice(-8)} status updated to ${newOrder.status}`;
              }
              showNotification(message, 'success');
            }
          });
        }
      }

      // Use functional update to prevent unnecessary re-renders
      setOrders(prevOrders => {
        // Only update if orders actually changed
        if (JSON.stringify(prevOrders) !== JSON.stringify(newOrders)) {
          return newOrders;
        }
        return prevOrders;
      });

      previousOrdersRef.current = newOrders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Don't update orders on error to prevent flickering
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [showNotification]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Refresh orders when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, refreshing orders for:', user.email);
      fetchOrders();
    }
  }, [isAuthenticated, user, fetchOrders]);

  // Add periodic refresh to catch status updates from admin panel
  useEffect(() => {
    if (isAuthenticated && user) {
      const interval = setInterval(() => {
        // Only refresh if page is visible to avoid unnecessary API calls
        if (document.visibilityState === 'visible') {
          axios.get(`/api/orders?expand=products&_t=${Date.now()}`)
            .then(response => {
              const newOrders = response.data;

              // Check if any order statuses have changed (silent update)
              if (previousOrdersRef.current.length > 0 && newOrders.length > 0) {
                const statusChanged = newOrders.some((newOrder, index) => {
                  const prevOrder = previousOrdersRef.current[index];
                  return prevOrder && prevOrder.status !== newOrder.status;
                });

                if (statusChanged) {
                  // Update orders silently (no loading state)
                  setOrders(newOrders);
                  previousOrdersRef.current = newOrders;
                }
              }
            })
            .catch(error => {
              console.error("Error refreshing orders:", error);
            });
        }
      }, 60000); // Refresh every 60 seconds (reduced frequency)

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

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === 'success'
                    ? 'bg-green-50 border-green-400 text-green-700'
                    : 'bg-blue-50 border-blue-400 text-blue-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
                onOrderUpdate={fetchOrders}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

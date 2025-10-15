import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatMoney } from "../utils/money";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const OrderSuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Get order ID from URL parameters or state
        const urlParams = new URLSearchParams(location.search);
        const orderId = urlParams.get('orderId') || location.state?.orderId;

        if (!orderId) {
          // No order ID found, redirect to orders page
          navigate('/orders');
          return;
        }

        // Fetch order details from API
        const response = await axios.get(`/api/orders/${orderId}?expand=products`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        // Redirect to orders page if order not found
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location, navigate]);

  const calculateItemsTotal = () => {
    if (!orderDetails || !orderDetails.products) return 0;
    return orderDetails.products.reduce((total, product) => {
      return total + product.priceCents * product.quantity;
    }, 0);
  };

  const calculateShippingTotal = () => {
    if (!orderDetails || !orderDetails.products) return 0;
    return orderDetails.products.reduce((total, product) => {
      return total + (product.deliveryOption?.priceCents || 0);
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateItemsTotal() + calculateShippingTotal();
    return Math.round(subtotal * 0.1);
  };

  const calculateOrderTotal = () => {
    return calculateItemsTotal() + calculateShippingTotal() + calculateTax();
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Order not found</p>
            <button
              onClick={() => navigate('/orders')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Order Confirmed!</h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Thank you for your order. We'll send you shipping updates at {orderDetails.userEmail || 'your email'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium text-gray-900">#{orderDetails.id.slice(-8).toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(orderDetails.dateOrdered).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900">
                      {orderDetails.paymentMethod === 'credit_card' && 'Credit Card'}
                      {orderDetails.paymentMethod === 'paypal' && 'PayPal'}
                      {orderDetails.paymentMethod === 'apple_pay' && 'Apple Pay'}
                      {orderDetails.paymentMethod === 'google_pay' && 'Google Pay'}
                      {!orderDetails.paymentMethod && 'Credit Card'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      orderDetails.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : orderDetails.status === 'shipped'
                        ? 'bg-purple-100 text-purple-800'
                        : orderDetails.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Items Ordered</h2>

                <div className="space-y-4">
                  {orderDetails.products && orderDetails.products.map((product) => (
                    <div key={product.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          className="w-16 h-16 object-cover rounded-lg"
                          src={`/${product.image}`}
                          alt={product.name}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Quantity: {product.quantity}
                        </p>
                        {product.deliveryOption && (
                          <p className="text-sm text-gray-600">
                            Delivery: {new Date(Date.now() + product.deliveryOption.deliveryDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric'
                            })} ({product.deliveryOption.priceCents > 0 ? formatMoney(product.deliveryOption.priceCents) : 'FREE'} shipping)
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatMoney(product.priceCents * product.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Summary</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{formatMoney(calculateItemsTotal())}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping & handling:</span>
                    <span className="font-medium">{formatMoney(calculateShippingTotal())}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatMoney(calculateItemsTotal() + calculateShippingTotal())}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">{formatMoney(calculateTax())}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Order Total:</span>
                    <span className="text-lg font-bold text-gray-900">{formatMoney(calculateOrderTotal())}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    View Order History
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-blue-50 rounded-xl p-6 mt-6">
                <h4 className="font-medium text-blue-900 mb-3">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• You'll receive an email confirmation shortly</li>
                  <li>• We'll send shipping updates to your email</li>
                  <li>• Track your order status in your account</li>
                  <li>• Contact us if you have any questions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

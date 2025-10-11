import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const TrackingPage = ({ cart }) => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");

  const [order, setOrder] = useState(null);
  const [productItem, setProductItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}?expand=products`);
        setOrder(response.data);

        // Find the specific product in the order
        const product = response.data.products.find(
          (p) => p.productId === productId
        );
        setProductItem(product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setLoading(false);
      }
    };

    if (orderId && productId) {
      fetchOrderData();
    }
  }, [orderId, productId]);

  const getTrackingStatus = () => {
    if (!productItem) return { status: "preparing", progress: 0, stage: 0 };

    const currentTime = Date.now();
    const orderTime = order.orderTimeMs;
    const deliveryTime = productItem.estimatedDeliveryTimeMs;
    const totalTime = deliveryTime - orderTime;
    const elapsedTime = currentTime - orderTime;

    if (currentTime >= deliveryTime) {
      return { status: "delivered", progress: 100, stage: 3 };
    } else if (elapsedTime > totalTime * 0.7) {
      return { status: "out-for-delivery", progress: 75, stage: 2.5 };
    } else if (elapsedTime > totalTime * 0.5) {
      return { status: "shipped", progress: 50, stage: 2 };
    } else if (elapsedTime > totalTime * 0.2) {
      return { status: "processing", progress: 25, stage: 1 };
    } else {
      return { status: "preparing", progress: 0, stage: 0 };
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      preparing: "bg-blue-500",
      processing: "bg-yellow-500",
      shipped: "bg-purple-500",
      "out-for-delivery": "bg-orange-500",
      delivered: "bg-green-500"
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    const icons = {
      preparing: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      processing: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      shipped: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      "out-for-delivery": (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      delivered: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[status] || icons.preparing;
  };

  if (loading) {
    return (
      <div>
        <title>Order Tracking</title>
        <Header cart={cart} />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order || !productItem) {
    return (
      <div>
        <title>Order Tracking</title>
        <Header cart={cart} />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-gray-600 mb-6">We couldn't find the order or product you're looking for.</p>
              <Link to="/orders" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                View All Orders
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const trackingStatus = getTrackingStatus();
  const deliveryDate = dayjs(productItem.estimatedDeliveryTimeMs);
  const orderDate = dayjs(order.orderTimeMs);

  return (
    <div>
      <title>Order Tracking - {productItem.product.name}</title>
      <Header cart={cart} />

      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Tracking</h1>
            <p className="text-blue-100 text-lg">Track your package in real-time</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Information Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Details</h3>

              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                    src={`/${productItem.product.image}`}
                    alt={productItem.product.name}
                  />
                  <div className={`absolute -top-1 -right-1 w-6 h-6 ${getStatusColor(trackingStatus.status)} rounded-full flex items-center justify-center text-white text-xs`}>
                    {getStatusIcon(trackingStatus.status)}
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-gray-900 text-lg">{productItem.product.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {productItem.quantity}</p>
                  <p className="text-sm font-medium text-gray-700">Order #{order.id.slice(-8)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Order Date</span>
                  <span className="text-sm font-medium text-gray-900">{orderDate.format("MMM D, YYYY")}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Estimated Delivery</span>
                  <span className="text-sm font-medium text-gray-900">{deliveryDate.format("MMM D, YYYY")}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(trackingStatus.status)}`}>
                    {getStatusIcon(trackingStatus.status)}
                    <span className="ml-1 capitalize">{trackingStatus.status.replace('-', ' ')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Timeline Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Progress</h3>

              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gray-200"></div>

                {/* Timeline Items */}
                <div className="space-y-8">
                  {/* Preparing */}
                  <div className="relative flex items-start">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      trackingStatus.stage >= 0 ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className={`font-medium ${trackingStatus.stage >= 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                        Order Received
                      </h4>
                      <p className={`text-sm ${trackingStatus.stage >= 0 ? 'text-gray-600' : 'text-gray-400'}`}>
                        {orderDate.format("MMM D, YYYY [at] h:mm A")}
                      </p>
                    </div>
                    {trackingStatus.stage >= 0 && (
                      <div className="text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Processing */}
                  <div className="relative flex items-start">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      trackingStatus.stage >= 1 ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className={`font-medium ${trackingStatus.stage >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                        Processing Order
                      </h4>
                      <p className={`text-sm ${trackingStatus.stage >= 1 ? 'text-gray-600' : 'text-gray-400'}`}>
                        Your order is being prepared for shipment
                      </p>
                    </div>
                    {trackingStatus.stage >= 1 && trackingStatus.stage < 2 && (
                      <div className="text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Shipped */}
                  <div className="relative flex items-start">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      trackingStatus.stage >= 2 ? 'bg-purple-500 border-purple-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className={`font-medium ${trackingStatus.stage >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                        Shipped
                      </h4>
                      <p className={`text-sm ${trackingStatus.stage >= 2 ? 'text-gray-600' : 'text-gray-400'}`}>
                        Your package is on its way to you
                      </p>
                    </div>
                    {trackingStatus.stage >= 2 && trackingStatus.stage < 3 && (
                      <div className="text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Out for Delivery */}
                  {trackingStatus.stage >= 2.5 && (
                    <div className="relative flex items-start">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                        trackingStatus.stage >= 2.5 ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-4 flex-grow">
                        <h4 className={`font-medium ${trackingStatus.stage >= 2.5 ? 'text-gray-900' : 'text-gray-500'}`}>
                          Out for Delivery
                        </h4>
                        <p className={`text-sm ${trackingStatus.stage >= 2.5 ? 'text-gray-600' : 'text-gray-400'}`}>
                          Your package is out for delivery today
                        </p>
                      </div>
                      {trackingStatus.stage >= 2.5 && trackingStatus.stage < 3 && (
                        <div className="text-green-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Delivered */}
                  <div className="relative flex items-start">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      trackingStatus.stage >= 3 ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className={`font-medium ${trackingStatus.stage >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>
                        Delivered
                      </h4>
                      <p className={`text-sm ${trackingStatus.stage >= 3 ? 'text-gray-600' : 'text-gray-400'}`}>
                        {deliveryDate.format("MMM D, YYYY")}
                      </p>
                    </div>
                    {trackingStatus.stage >= 3 && (
                      <div className="text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(trackingStatus.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(trackingStatus.status)}`}
                    style={{ width: `${trackingStatus.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Orders Button */}
        <div className="mt-8 text-center">
          <Link to="/orders" className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-300">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;

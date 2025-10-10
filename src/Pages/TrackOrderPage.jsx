import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const TrackOrderPage = ({ cart }) => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [trackingResults, setTrackingResults] = useState(null);

  // Mock tracking data
  const mockTrackingData = {
    orderNumber: "SE-2024-001234",
    status: "In Transit",
    estimatedDelivery: "March 15, 2024",
    trackingNumber: "1Z999AA1234567890",
    carrier: "UPS",
    items: [
      { name: "Wireless Bluetooth Headphones", quantity: 1, price: "$89.99" },
      { name: "Phone Case - Black", quantity: 2, price: "$19.99" }
    ],
    timeline: [
      { status: "Order Placed", date: "March 10, 2024", time: "2:30 PM", completed: true },
      { status: "Payment Confirmed", date: "March 10, 2024", time: "2:32 PM", completed: true },
      { status: "Processing", date: "March 11, 2024", time: "9:15 AM", completed: true },
      { status: "Shipped", date: "March 12, 2024", time: "11:45 AM", completed: true },
      { status: "In Transit", date: "March 13, 2024", time: "8:20 AM", completed: true },
      { status: "Out for Delivery", date: "March 15, 2024", time: "7:00 AM", completed: false },
      { status: "Delivered", date: "March 15, 2024", time: "2:30 PM", completed: false }
    ]
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    // Mock API call
    setTrackingResults(mockTrackingData);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'in transit': return 'text-blue-600 bg-blue-100';
      case 'out for delivery': return 'text-orange-600 bg-orange-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Track Order - ShopEase</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Track Your Order</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter your order details below to track your package and get real-time updates on your delivery.
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enter Order Details</h2>
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. SE-2024-001234"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingResults && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Order Status</h2>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trackingResults.status)}`}>
                {trackingResults.status}
              </span>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Order Number:</span> {trackingResults.orderNumber}</p>
                  <p><span className="font-medium">Tracking Number:</span> {trackingResults.trackingNumber}</p>
                  <p><span className="font-medium">Carrier:</span> {trackingResults.carrier}</p>
                  <p><span className="font-medium">Est. Delivery:</span> {trackingResults.estimatedDelivery}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Items in Order</h3>
                <div className="space-y-3">
                  {trackingResults.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Tracking Timeline</h3>
              <div className="space-y-4">
                {trackingResults.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-4 h-4 rounded-full mt-2 ${event.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${event.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                          {event.status}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {event.date} at {event.time}
                        </div>
                      </div>
                      {index === trackingResults.timeline.length - 1 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Package is on the way!</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find your order or have questions about your delivery? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
            >
              Order Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;

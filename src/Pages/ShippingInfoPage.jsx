import React from "react";
import Header from "../components/Header";

const ShippingInfoPage = ({ cart }) => {
  const shippingOptions = [
    {
      name: "Standard Shipping",
      time: "5-7 business days",
      cost: "Free on orders over $50",
      description: "Delivered via USPS or UPS Ground"
    },
    {
      name: "Express Shipping",
      time: "2-3 business days",
      cost: "$9.99",
      description: "Faster delivery via UPS 2nd Day Air"
    },
    {
      name: "Overnight Shipping",
      time: "1 business day",
      cost: "$19.99",
      description: "Next business day delivery via UPS Next Day Air"
    },
    {
      name: "International Shipping",
      time: "7-14 business days",
      cost: "$24.99",
      description: "Available to select countries worldwide"
    }
  ];

  const shippingZones = [
    { region: "United States", zones: ["Continental US", "Alaska", "Hawaii", "Puerto Rico"] },
    { region: "Canada", zones: ["All Provinces"] },
    { region: "Europe", zones: ["UK", "Germany", "France", "Italy", "Spain", "Netherlands"] },
    { region: "Asia Pacific", zones: ["Australia", "Japan", "South Korea", "Singapore"] }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Shipping Information - ShopEase</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Shipping Information</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fast, reliable shipping options to get your orders delivered safely and on time.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shippingOptions.map((option, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {option.time}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {option.cost}
                  </p>
                  <p className="text-sm">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Zones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shippingZones.map((zone, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{zone.region}</h3>
                <div className="flex flex-wrap gap-2">
                  {zone.zones.map((subzone, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {subzone}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Processing Time</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Orders processed within 1-2 business days
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Express orders processed same business day (before 2 PM EST)
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Weekend orders processed on next business day
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Tracking numbers provided for all shipments
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Signature required for orders over $500
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Delivery attempts made up to 3 times
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions About Shipping?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our customer service team is here to help with any shipping questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              Contact Support
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
              Track Your Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;

import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const ReturnsExchangesPage = ({ cart }) => {
  const navigate = useNavigate();
  const [returnForm, setReturnForm] = useState({
    orderNumber: "",
    reason: "",
    returnMethod: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleReturnSubmission = async (event) => {
    event.preventDefault();

    // Validate form
    if (!returnForm.orderNumber.trim()) {
      alert('Please enter your order number');
      return;
    }

    if (!returnForm.reason) {
      alert('Please select a reason for return');
      return;
    }

    if (!returnForm.returnMethod) {
      alert('Please select a return method');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful return initiation
      // Reset form
      setReturnForm({
        orderNumber: "",
        reason: "",
        returnMethod: ""
      });

      alert(`Return request initiated successfully! You will receive a return label via email within 24 hours for order ${returnForm.orderNumber}.`);
    } catch (error) {
      console.error('Return initiation error:', error);
      alert('Failed to initiate return. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const returnPolicies = [
    {
      title: "30-Day Return Policy",
      description: "Return most items within 30 days of delivery for a full refund",
      details: "Items must be in original condition with tags attached"
    },
    {
      title: "Free Return Shipping",
      description: "Free return shipping on orders over $75",
      details: "Return labels provided for eligible items"
    },
    {
      title: "Instant Exchanges",
      description: "Exchange items instantly for different sizes or colors",
      details: "Subject to availability in our warehouse"
    },
    {
      title: "Extended Holiday Returns",
      description: "Extended return period during holiday seasons",
      details: "Returns accepted until January 31st for holiday purchases"
    }
  ];

  const nonReturnableItems = [
    "Personalized or customized products",
    "Items marked as final sale",
    "Gift cards and digital products",
    "Perishable goods (food, flowers, plants)",
    "Items damaged due to misuse",
    "Products without original packaging"
  ];

  const returnSteps = [
    {
      step: "1",
      title: "Initiate Return",
      description: "Log into your account and select the items you want to return"
    },
    {
      step: "2",
      title: "Print Label",
      description: "Print your prepaid return shipping label or schedule pickup"
    },
    {
      step: "3",
      title: "Pack Items",
      description: "Pack items securely in original packaging with all accessories"
    },
    {
      step: "4",
      title: "Ship Items",
      description: "Drop off at any UPS location or schedule home pickup"
    },
    {
      step: "5",
      title: "Receive Refund",
      description: "Refunds processed within 5-7 business days of receiving items"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Returns & Exchanges - ShopEase</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Returns & Exchanges</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Shop with confidence knowing you can easily return or exchange items that don't meet your expectations.
          </p>
        </div>

        {/* Return Policies */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Return Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {returnPolicies.map((policy, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{policy.title}</h3>
                <p className="text-gray-700 mb-3">{policy.description}</p>
                <p className="text-gray-600 text-sm">{policy.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Make a Return</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {returnSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Returnable Items */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Items Not Eligible for Return</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nonReturnableItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exchange Information */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Exchange Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Size Exchanges</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Same item, different size - Free exchange
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Color exchanges available for most items
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Express exchange processing available
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Exchange Timeframes</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Exchanges processed within 14 days
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  New items shipped within 1-2 business days
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Original shipping charges refunded
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help with a Return?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our customer service team is available to assist with any return or exchange questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                // Scroll to return form section
                const returnForm = document.getElementById('return-form');
                if (returnForm) {
                  returnForm.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300"
            >
              Start a Return
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-green-500 hover:text-green-600 transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Return Form Section */}
        <div id="return-form" className="mt-16">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Start Your Return</h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
                      <input
                        type="text"
                        value={returnForm.orderNumber}
                        onChange={(e) => setReturnForm({...returnForm, orderNumber: e.target.value})}
                        placeholder="e.g. SE-2024-001234"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Return</label>
                      <select
                        value={returnForm.reason}
                        onChange={(e) => setReturnForm({...returnForm, reason: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select a reason</option>
                        <option value="wrong-size">Wrong size</option>
                        <option value="not-as-described">Item not as described</option>
                        <option value="changed-mind">Changed my mind</option>
                        <option value="defective">Defective item</option>
                        <option value="damaged">Arrived damaged</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="radio"
                        name="return-method"
                        value="mail"
                        checked={returnForm.returnMethod === "mail"}
                        onChange={(e) => setReturnForm({...returnForm, returnMethod: e.target.value})}
                        className="text-green-600"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">Mail-in Return</h4>
                        <p className="text-sm text-gray-600">Free return shipping label provided</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="radio"
                        name="return-method"
                        value="dropoff"
                        checked={returnForm.returnMethod === "dropoff"}
                        onChange={(e) => setReturnForm({...returnForm, returnMethod: e.target.value})}
                        className="text-green-600"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">Drop-off Return</h4>
                        <p className="text-sm text-gray-600">Return at any UPS location</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="radio"
                        name="return-method"
                        value="pickup"
                        checked={returnForm.returnMethod === "pickup"}
                        onChange={(e) => setReturnForm({...returnForm, returnMethod: e.target.value})}
                        className="text-green-600"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">Scheduled Pickup</h4>
                        <p className="text-sm text-gray-600">We'll pick up from your location</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleReturnSubmission}
                  disabled={isSubmitting}
                  className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Processing Return...' : 'Initiate Return Process'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchangesPage;

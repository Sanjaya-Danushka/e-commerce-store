import React from "react";
import Header from "../components/Header";

const WholesalePage = ({ cart }) => {
  const wholesaleBenefits = [
    {
      icon: "🏭",
      title: "Bulk Discounts",
      description: "Significant savings on large quantity orders with tiered pricing based on volume."
    },
    {
      icon: "🚚",
      title: "Fast Shipping",
      description: "Priority processing and expedited shipping options for wholesale orders."
    },
    {
      icon: "📦",
      title: "Custom Packaging",
      description: "Branded packaging and custom labeling options for your business needs."
    },
    {
      icon: "🔒",
      title: "Dedicated Support",
      description: "Personal account manager and priority customer service for wholesale clients."
    }
  ];

  const productCategories = [
    {
      name: "Electronics",
      items: "2,500+ products",
      minOrder: "10 units",
      discount: "15-35%"
    },
    {
      name: "Fashion & Apparel",
      items: "5,200+ products",
      minOrder: "25 units",
      discount: "20-40%"
    },
    {
      name: "Home & Garden",
      items: "1,800+ products",
      minOrder: "15 units",
      discount: "18-35%"
    },
    {
      name: "Sports & Outdoors",
      items: "3,100+ products",
      minOrder: "20 units",
      discount: "12-30%"
    }
  ];

  const requirements = [
    {
      title: "Business Registration",
      description: "Valid business license or registration certificate required",
      icon: "📋"
    },
    {
      title: "Tax ID",
      description: "Valid tax identification number for wholesale pricing",
      icon: "🆔"
    },
    {
      title: "Minimum Order",
      description: "Meet minimum order quantities per product category",
      icon: "📊"
    },
    {
      title: "Resale Purpose",
      description: "Products must be purchased for resale purposes only",
      icon: "🏪"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Wholesale - ShopEase</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Wholesale Program</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Partner with ShopEase for wholesale opportunities. Access bulk pricing,
            dedicated support, and a wide range of products for your business.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose ShopEase Wholesale?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wholesaleBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="text-4xl">{benefit.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Product Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productCategories.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <p>📦 {category.items}</p>
                  <p>📊 Min. Order: {category.minOrder}</p>
                  <p>💰 Discount: {category.discount}</p>
                </div>
                <button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  View Products
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Program Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="text-3xl">{req.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{req.title}</h3>
                  <p className="text-gray-600">{req.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Volume Pricing Tiers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-900 font-semibold">Monthly Volume</th>
                  <th className="text-left py-4 px-4 text-gray-900 font-semibold">Base Discount</th>
                  <th className="text-left py-4 px-4 text-gray-900 font-semibold">Additional Benefits</th>
                  <th className="text-left py-4 px-4 text-gray-900 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">$5,000 - $24,999</td>
                  <td className="py-4 px-4 font-semibold text-green-600">15%</td>
                  <td className="py-4 px-4">Standard support, 48h processing</td>
                  <td className="py-4 px-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">$25,000 - $99,999</td>
                  <td className="py-4 px-4 font-semibold text-green-600">25%</td>
                  <td className="py-4 px-4">Priority support, 24h processing, Free shipping</td>
                  <td className="py-4 px-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">$100,000 - $499,999</td>
                  <td className="py-4 px-4 font-semibold text-green-600">35%</td>
                  <td className="py-4 px-4">Dedicated manager, Custom terms, Marketing support</td>
                  <td className="py-4 px-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">$500,000+</td>
                  <td className="py-4 px-4 font-semibold text-green-600">45%</td>
                  <td className="py-4 px-4">Custom pricing, Exclusive products, Partnership opportunities</td>
                  <td className="py-4 px-4">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Contact Us
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Apply */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Apply</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit Application</h3>
              <p className="text-gray-600">Fill out our wholesale application form with your business details.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Review</h3>
              <p className="text-gray-600">Our team reviews your application and business documents within 2-3 business days.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Approved</h3>
              <p className="text-gray-600">Once approved, you'll receive wholesale pricing and access to our B2B platform.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need More Information?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our wholesale team is here to help you get started. Contact us for personalized assistance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div>
              <div className="text-3xl mb-2">📞</div>
              <p className="font-semibold text-gray-900">Phone</p>
              <p className="text-gray-600">1-800-WHOLESALE</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📧</div>
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-gray-600">wholesale@shopease.com</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💬</div>
              <p className="font-semibold text-gray-900">Live Chat</p>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              Apply for Wholesale
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
              Download Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesalePage;

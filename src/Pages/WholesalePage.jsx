import React, { useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const WholesalePage = ({ cart }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "products", "apply", "contact", "catalog"
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    annualRevenue: "",
    website: "",
    address: "",
    taxId: "",
    businessDescription: "",
    monthlyVolume: ""
  });

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

  const handleViewProducts = (categoryName) => {
    setSelectedCategory(categoryName);
    setModalType("products");
    setShowModal(true);
  };

  const handleTierApplication = (tierInfo) => {
    setSelectedTier(tierInfo);
    setModalType("apply");
    setShowModal(true);
  };

  const handleContactUs = () => {
    setModalType("contact");
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submissionData = {
        ...formData,
        applicationType: modalType,
        tierApplied: modalType === "apply" ? selectedTier : "General Wholesale Application",
        categoryInterest: modalType === "products" ? selectedCategory : "",
        submittedAt: new Date().toISOString()
      };

      const response = await axios.post('/api/wholesale/apply', submissionData);

      if (response.status === 200) {
        alert(`Thank you for your ${modalType === "apply" ? `application for ${selectedTier}` : modalType === "contact" ? "inquiry" : "application"}! We'll review it and get back to you soon.`);
        setShowModal(false);
        setFormData({
          businessName: "",
          contactName: "",
          email: "",
          phone: "",
          businessType: "",
          annualRevenue: "",
          website: "",
          address: "",
          taxId: "",
          businessDescription: "",
          monthlyVolume: ""
        });
      }
    } catch (error) {
      console.error('Wholesale application submission error:', error);
      alert('Failed to submit application. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      businessType: "",
      annualRevenue: "",
      website: "",
      address: "",
      taxId: "",
      businessDescription: "",
      monthlyVolume: ""
    });
  };

  const downloadCatalog = () => {
    // Create a comprehensive wholesale catalog
    const catalogContent = `ShopEase Wholesale Catalog
==========================

Company Overview:
- Leading e-commerce platform with 10M+ customers
- 500+ brand partnerships
- Global shipping capabilities
- Dedicated wholesale support team

Product Categories & Pricing:

📱 ELECTRONICS (2,500+ products)
• Smartphones & Accessories
• Laptops & Computers
• Audio & Headphones
• Smart Home Devices
• Gaming Consoles & Accessories
• Cameras & Photography Equipment
Min. Order: 10 units | Discount: 15-35%

👕 FASHION & APPAREL (5,200+ products)
• Men's & Women's Clothing
• Shoes & Footwear
• Bags & Accessories
• Jewelry & Watches
• Sportswear & Activewear
• Underwear & Lingerie
Min. Order: 25 units | Discount: 20-40%

🏠 HOME & GARDEN (1,800+ products)
• Furniture & Decor
• Kitchen & Dining
• Bedding & Bath
• Garden Tools & Equipment
• Home Appliances
• Storage & Organization
Min. Order: 15 units | Discount: 18-35%

⚽ SPORTS & OUTDOORS (3,100+ products)
• Fitness Equipment
• Outdoor Gear & Camping
• Sports Apparel & Shoes
• Team Sports Equipment
• Water Sports & Recreation
• Hunting & Fishing Gear
Min. Order: 20 units | Discount: 12-30%

Volume Pricing Tiers:
• $5,000-$24,999/month: 15% discount
• $25,000-$99,999/month: 25% discount + Free shipping
• $100,000-$499,999/month: 35% discount + Dedicated manager
• $500,000+/month: 45% discount + Custom terms

Requirements:
• Valid business registration
• Tax ID for wholesale pricing
• Minimum order quantities by category
• Products for resale purposes only

Contact Information:
📞 Phone: 1-800-WHOLESALE
📧 Email: wholesale@shopease.com
💬 Live Chat: Available 24/7

Application Process:
1. Submit application with business details
2. Document review (2-3 business days)
3. Approval and wholesale pricing activation
4. Access to B2B platform and dedicated support

For inquiries or to get started, contact our wholesale team at wholesale@shopease.com`;

    // Create and download the file
    const blob = new Blob([catalogContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ShopEase-Wholesale-Catalog.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
                <button
                  onClick={() => handleViewProducts(category.name)}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
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
                    <button
                      onClick={() => handleTierApplication("$5,000 - $24,999")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">$25,000 - $99,999</td>
                  <td className="py-4 px-4 font-semibold text-green-600">25%</td>
                  <td className="py-4 px-4">Priority support, 24h processing, Free shipping</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleTierApplication("$25,000 - $99,999")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">$100,000 - $499,999</td>
                  <td className="py-4 px-4 font-semibold text-green-600">35%</td>
                  <td className="py-4 px-4">Dedicated manager, Custom terms, Marketing support</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleTierApplication("$100,000 - $499,999")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">$500,000+</td>
                  <td className="py-4 px-4 font-semibold text-green-600">45%</td>
                  <td className="py-4 px-4">Custom pricing, Exclusive products, Partnership opportunities</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={handleContactUs}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Contact Us
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
            <button
              onClick={() => {
                setModalType("apply");
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Apply for Wholesale
            </button>
            <button
              onClick={downloadCatalog}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
            >
              Download Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalType === "products" ? `View ${selectedCategory} Products` :
                   modalType === "apply" ? `Apply for ${selectedTier} Tier` :
                   modalType === "contact" ? "Contact Wholesale Team" :
                   "Download Wholesale Catalog"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {modalType === "products" ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">{selectedCategory} Category</h3>
                    <p className="text-blue-800 mb-4">
                      Browse our extensive collection of {selectedCategory.toLowerCase()} products with wholesale pricing.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedCategory === "Electronics" && [
                        "Smartphones", "Laptops", "Headphones", "Smart Watches", "Tablets", "Cameras"
                      ].map((product, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <p className="text-sm font-medium">{product}</p>
                        </div>
                      ))}
                      {selectedCategory === "Fashion & Apparel" && [
                        "Men's Clothing", "Women's Clothing", "Shoes", "Accessories", "Sportswear", "Underwear"
                      ].map((product, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl mb-2">👕</div>
                          <p className="text-sm font-medium">{product}</p>
                        </div>
                      ))}
                      {selectedCategory === "Home & Garden" && [
                        "Furniture", "Kitchenware", "Bedding", "Decor", "Garden Tools", "Storage"
                      ].map((product, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl mb-2">🏠</div>
                          <p className="text-sm font-medium">{product}</p>
                        </div>
                      ))}
                      {selectedCategory === "Sports & Outdoors" && [
                        "Fitness Equipment", "Outdoor Gear", "Sports Apparel", "Team Sports", "Water Sports", "Camping"
                      ].map((product, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl mb-2">⚽</div>
                          <p className="text-sm font-medium">{product}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : modalType === "catalog" ? (
                <div className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-green-900 mb-3">Catalog Downloaded!</h3>
                    <p className="text-green-800 mb-4">
                      Your wholesale catalog has been downloaded successfully. The file includes:
                    </p>
                    <ul className="text-green-800 space-y-2">
                      <li>• Complete product catalog with pricing</li>
                      <li>• Volume discount tiers and requirements</li>
                      <li>• Contact information and application process</li>
                      <li>• Business requirements and qualifications</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={downloadCatalog}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Download Again
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Business Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Full Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="business@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select business type</option>
                        <option value="retail-store">Retail Store</option>
                        <option value="online-store">Online Store</option>
                        <option value="distributor">Distributor</option>
                        <option value="dropshipper">Dropshipper</option>
                        <option value="reseller">Reseller</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Revenue
                      </label>
                      <select
                        name="annualRevenue"
                        value={formData.annualRevenue}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select annual revenue</option>
                        <option value="0-100k">$0 - $100K</option>
                        <option value="100k-500k">$100K - $500K</option>
                        <option value="500k-1m">$500K - $1M</option>
                        <option value="1m-5m">$1M - $5M</option>
                        <option value="5m+">$5M+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourbusiness.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123 Business St, City, State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID/EIN
                      </label>
                      <input
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="12-3456789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Monthly Volume
                      </label>
                      <select
                        name="monthlyVolume"
                        value={formData.monthlyVolume}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select expected volume</option>
                        <option value="0-5000">$0 - $5,000</option>
                        <option value="5000-25000">$5,000 - $25,000</option>
                        <option value="25000-100000">$25,000 - $100,000</option>
                        <option value="100000-500000">$100,000 - $500,000</option>
                        <option value="500000+">$500,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </label>
                    <textarea
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your business, target market, and why you want to partner with ShopEase..."
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        isLoading
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      }`}
                    >
                      {isLoading ? 'Submitting...' : `Submit ${modalType === "apply" ? "Tier Application" : "Application"}`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WholesalePage;

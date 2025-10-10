import React, { useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const AffiliateProgramPage = ({ cart }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "tier", "apply", or "learn"
  const [selectedTier, setSelectedTier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    socialMedia: "",
    audienceSize: "",
    primaryPlatform: "",
    experience: "",
    motivation: ""
  });

  const benefits = [
    {
      icon: "💰",
      title: "Competitive Commissions",
      description: "Earn up to 15% commission on every sale you refer. Higher rates available for top performers."
    },
    {
      icon: "📊",
      title: "Real-time Tracking",
      description: "Advanced tracking system lets you monitor clicks, conversions, and earnings in real-time."
    },
    {
      icon: "🎯",
      title: "Marketing Materials",
      description: "Access to banners, text links, and promotional materials to maximize your conversions."
    },
    {
      icon: "💳",
      title: "Monthly Payouts",
      description: "Reliable monthly payments with multiple payout options including PayPal and bank transfer."
    }
  ];

  const tiers = [
    {
      name: "Bronze",
      minSales: "0-9",
      commission: "8%",
      benefits: ["Standard marketing materials", "Monthly newsletter", "Basic support"]
    },
    {
      name: "Silver",
      minSales: "10-49",
      commission: "12%",
      benefits: ["Enhanced marketing materials", "Priority support", "Exclusive promotions", "Performance bonuses"]
    },
    {
      name: "Gold",
      minSales: "50-199",
      commission: "15%",
      benefits: ["Premium marketing materials", "Dedicated account manager", "Custom promotions", "Higher commission rates", "Early access to sales"]
    },
    {
      name: "Platinum",
      minSales: "200+",
      commission: "18%",
      benefits: ["All Gold benefits", "Custom landing pages", "Exclusive partnerships", "Revenue sharing opportunities", "VIP event invitations"]
    }
  ];

  const handleTierApplication = (tierName) => {
    setSelectedTier(tierName);
    setModalType("tier");
    setShowModal(true);
  };

  const handleGeneralApplication = () => {
    setModalType("apply");
    setShowModal(true);
  };

  const handleLearnMore = () => {
    setModalType("learn");
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
        tierApplied: modalType === "tier" ? selectedTier : "General Application",
        submittedAt: new Date().toISOString()
      };

      const response = await axios.post('/api/affiliate/apply', submissionData);

      if (response.status === 200) {
        alert(`Thank you for your ${modalType === "tier" ? `application for ${selectedTier} tier` : "affiliate application"}! We'll review it and get back to you soon.`);
        setShowModal(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          website: "",
          socialMedia: "",
          audienceSize: "",
          primaryPlatform: "",
          experience: "",
          motivation: ""
        });
      }
    } catch (error) {
      console.error('Affiliate application submission error:', error);
      alert('Failed to submit application. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      socialMedia: "",
      audienceSize: "",
      primaryPlatform: "",
      experience: "",
      motivation: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Affiliate Program - ShopEase</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Affiliate Program</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our affiliate program and earn money by promoting ShopEase products.
            Turn your audience into a revenue stream with our competitive commission rates.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Join Our Program?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
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

        {/* Commission Tiers */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Commission Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <div key={index} className={`border-2 rounded-xl p-6 text-center ${index === 3 ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-blue-300'} transition-all duration-300`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-2">{tier.minSales} sales/month</p>
                <div className="text-3xl font-bold text-green-600 mb-4">{tier.commission}</div>
                <ul className="text-left space-y-2">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleTierApplication(tier.name)}
                  className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    index === 3
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {index === 3 ? 'Apply for Platinum' : 'Join Tier'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful affiliates who are already earning money with ShopEase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGeneralApplication}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Apply Now
            </button>
            <button
              onClick={handleLearnMore}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
            >
              Learn More
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
                  {modalType === "tier" ? `Apply for ${selectedTier} Tier` :
                   modalType === "apply" ? "Join Affiliate Program" :
                   "Affiliate Program Details"}
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

              {modalType === "learn" ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">Program Overview</h3>
                    <p className="text-blue-800 mb-4">
                      Our affiliate program offers competitive commissions and comprehensive support to help you succeed.
                    </p>
                    <ul className="text-blue-800 space-y-2">
                      <li>• Up to 18% commission rates</li>
                      <li>• Real-time tracking and reporting</li>
                      <li>• Monthly payouts via multiple methods</li>
                      <li>• Dedicated affiliate support team</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-green-900 mb-3">Getting Started</h3>
                    <ol className="text-green-800 space-y-2 list-decimal list-inside">
                      <li>Submit your application with your platform details</li>
                      <li>Our team reviews your application within 48 hours</li>
                      <li>Once approved, receive your unique affiliate links</li>
                      <li>Start promoting and earning commissions immediately</li>
                    </ol>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-purple-900 mb-3">Support & Resources</h3>
                    <p className="text-purple-800">
                      Access marketing materials, performance analytics, and dedicated support to maximize your success.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

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
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website/Blog URL *
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Media Handles
                      </label>
                      <input
                        type="text"
                        name="socialMedia"
                        value={formData.socialMedia}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="@yourhandle or facebook.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audience Size
                      </label>
                      <select
                        name="audienceSize"
                        value={formData.audienceSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select audience size</option>
                        <option value="0-1000">0-1,000 followers</option>
                        <option value="1000-10000">1,000-10,000 followers</option>
                        <option value="10000-50000">10,000-50,000 followers</option>
                        <option value="50000-100000">50,000-100,000 followers</option>
                        <option value="100000+">100,000+ followers</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Platform
                    </label>
                    <select
                      name="primaryPlatform"
                      value={formData.primaryPlatform}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select primary platform</option>
                      <option value="blog">Blog/Website</option>
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="twitter">Twitter</option>
                      <option value="facebook">Facebook</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marketing Experience
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your marketing experience and why you'd be a great affiliate..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to join our affiliate program?
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Share your motivation for joining our affiliate program..."
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
                      {isLoading ? 'Submitting...' : `Submit ${modalType === "tier" ? "Tier Application" : "Application"}`}
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

export default AffiliateProgramPage;

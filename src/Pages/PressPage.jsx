import React from "react";
import Header from "../components/Header";

const PressPage = ({ cart }) => {
  const pressReleases = [
    {
      title: "ShopEase Announces $50M Series B Funding Round",
      date: "March 15, 2024",
      excerpt: "Leading e-commerce platform secures major investment to fuel international expansion and technology innovation.",
      link: "#"
    },
    {
      title: "ShopEase Partners with Leading Global Brands",
      date: "February 28, 2024",
      excerpt: "New partnerships bring exclusive products and enhanced shopping experience to customers worldwide.",
      link: "#"
    },
    {
      title: "ShopEase Launches Revolutionary AI-Powered Shopping Assistant",
      date: "January 20, 2024",
      excerpt: "New AI technology helps customers discover perfect products with personalized recommendations.",
      link: "#"
    },
    {
      title: "ShopEase Reports Record-Breaking Holiday Season Sales",
      date: "January 5, 2024",
      excerpt: "Company achieves 200% year-over-year growth during holiday shopping period.",
      link: "#"
    }
  ];

  const mediaCoverage = [
    {
      outlet: "TechCrunch",
      title: "How ShopEase is Revolutionizing Online Shopping",
      date: "March 10, 2024",
      link: "#"
    },
    {
      outlet: "Forbes",
      title: "ShopEase: The Next Big Player in E-commerce",
      date: "February 25, 2024",
      link: "#"
    },
    {
      outlet: "The Wall Street Journal",
      title: "E-commerce Startups Adapt to Changing Consumer Behavior",
      date: "February 15, 2024",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Press - ShopEase</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Press Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and media coverage about ShopEase.
          </p>
        </div>

        {/* Press Contact */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Press Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Media Inquiries</h3>
                <div className="space-y-2 text-gray-600">
                  <p>📧 press@shopease.com</p>
                  <p>📞 +1 (555) 123-4567</p>
                  <p>📍 123 Commerce Street, New York, NY 10001</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Press Kit</h3>
                <p className="text-gray-600 mb-4">
                  Download our press kit including company logos, executive photos, and brand assets.
                </p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                  Download Press Kit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Press Releases */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Press Releases</h2>
          <div className="space-y-8">
            {pressReleases.map((release, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 p-4 rounded-r-lg transition-colors">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{release.title}</h3>
                <p className="text-gray-600 mb-2">{release.date}</p>
                <p className="text-gray-700 mb-4">{release.excerpt}</p>
                <a href={release.link} className="text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Media Coverage */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaCoverage.map((article, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{article.outlet}</h3>
                <p className="text-gray-700 mb-3">{article.title}</p>
                <p className="text-gray-600 text-sm mb-4">{article.date}</p>
                <a href={article.link} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Read Article →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">ShopEase in Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10M+</div>
              <div className="text-gray-700">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-700">Brand Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-700">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-700">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressPage;

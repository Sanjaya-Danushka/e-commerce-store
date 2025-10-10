import React, { useState } from "react";
import Header from "../components/Header";

const PressPage = ({ cart }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  const pressReleases = [
    {
      id: 1,
      title: "ShopEase Announces $50M Series B Funding Round",
      date: "March 15, 2024",
      excerpt: "Leading e-commerce platform secures major investment to fuel international expansion and technology innovation.",
      content: `NEW YORK, NY – March 15, 2024 – ShopEase, the rapidly growing e-commerce platform, today announced the successful completion of a $50 million Series B funding round led by prominent venture capital firms.

The funding will be used to accelerate international expansion, enhance the platform's AI-powered recommendation engine, and invest in logistics infrastructure to improve delivery times globally.

"ShopEase has demonstrated exceptional growth and innovation in the e-commerce space," said Sarah Johnson, Partner at Lead Investor Ventures. "Their customer-centric approach and technology-driven solutions position them perfectly for continued success."

Since its launch in 2022, ShopEase has achieved:
• 10 million+ registered users
• 500+ brand partnerships
• 200% year-over-year growth
• Expansion to 50+ countries

The company plans to use the new capital to:
• Expand operations to Europe and Asia-Pacific markets
• Enhance mobile app capabilities
• Invest in sustainable packaging solutions
• Grow the engineering and product teams

"This funding validates our vision of creating the most customer-friendly e-commerce experience," said ShopEase CEO, Alex Chen. "We're excited to bring our innovative shopping platform to even more customers worldwide."`,
      link: "#"
    },
    {
      id: 2,
      title: "ShopEase Partners with Leading Global Brands",
      date: "February 28, 2024",
      excerpt: "New partnerships bring exclusive products and enhanced shopping experience to customers worldwide.",
      content: `NEW YORK, NY – February 28, 2024 – ShopEase today announced strategic partnerships with several leading global brands, bringing exclusive products and enhanced shopping experiences to millions of customers.

The partnerships include:
• Nike: Exclusive limited-edition collections
• Apple: Authorized reseller with premium support
• Samsung: Latest electronics with bundle deals
• Sony: Gaming and entertainment products
• Dell: Computing solutions for home and business

"These partnerships represent a significant milestone in ShopEase's growth journey," said VP of Partnerships, Maria Rodriguez. "By collaborating with world-class brands, we can offer our customers access to premium products with exceptional service."

The partnerships will also include:
• Co-branded marketing campaigns
• Exclusive launch events
• Enhanced customer support
• Bundle deals and special pricing

ShopEase customers will now have access to:
• Authentic products with full warranties
• Competitive pricing on premium brands
• Fast, reliable delivery
• 24/7 customer support

This announcement follows ShopEase's recent $50M funding round and represents the company's continued commitment to building the ultimate shopping destination.`,
      link: "#"
    },
    {
      id: 3,
      title: "ShopEase Launches Revolutionary AI-Powered Shopping Assistant",
      date: "January 20, 2024",
      excerpt: "New AI technology helps customers discover perfect products with personalized recommendations.",
      content: `SAN FRANCISCO, CA – January 20, 2024 – ShopEase today unveiled its revolutionary AI-powered shopping assistant, "ShopEase AI," designed to transform the online shopping experience through personalized recommendations and intelligent product discovery.

The new AI assistant features:
• Natural language product search
• Personalized style recommendations
• Smart size and fit suggestions
• Real-time inventory updates
• Gift recommendation engine

"ShopEase AI represents the future of e-commerce," said CTO, Dr. Jennifer Park. "By combining advanced machine learning with deep understanding of customer preferences, we're making product discovery effortless and enjoyable."

Key capabilities include:
• Voice-activated product search
• Visual similarity matching
• Personalized shopping journeys
• Smart filtering and sorting
• Predictive restocking alerts

Beta testing showed:
• 40% increase in conversion rates
• 60% improvement in customer satisfaction
• 25% reduction in return rates
• Enhanced discovery of new products

The AI assistant is available across all ShopEase platforms and learns from each customer interaction to provide increasingly personalized recommendations over time.

"Every customer is unique, and our AI understands that," added Dr. Park. "We're excited to see how this technology will revolutionize the shopping experience for millions of users."`,
      link: "#"
    },
    {
      id: 4,
      title: "ShopEase Reports Record-Breaking Holiday Season Sales",
      date: "January 5, 2024",
      excerpt: "Company achieves 200% year-over-year growth during holiday shopping period.",
      content: `NEW YORK, NY – January 5, 2024 – ShopEase today announced record-breaking results for the 2023 holiday shopping season, with 200% year-over-year growth and unprecedented customer engagement.

Holiday Season Highlights:
• $2.1 billion in gross merchandise value
• 15 million orders processed
• 8 million new customer acquisitions
• 98.5% on-time delivery rate
• 99.2% customer satisfaction score

"2023 was a transformative year for ShopEase," said CEO Alex Chen. "Our focus on customer experience, innovative technology, and strategic partnerships has positioned us as a leader in the e-commerce space."

Key success factors included:
• Enhanced mobile shopping experience
• AI-powered product recommendations
• Expanded same-day delivery options
• Strategic brand partnerships
• Competitive pricing and promotions

The company saw particularly strong performance in:
• Electronics and gadgets
• Fashion and accessories
• Home and lifestyle products
• Health and wellness items

Looking ahead to 2024, ShopEase plans to:
• Expand to new international markets
• Launch innovative shopping features
• Strengthen brand partnerships
• Invest in sustainable practices

"These results validate our customer-first approach," Chen continued. "We're grateful to our customers, partners, and team for making this holiday season our most successful yet."

ShopEase's growth trajectory shows no signs of slowing, with the company well-positioned for continued expansion in the coming year.`,
      link: "#"
    }
  ];

  const mediaCoverage = [
    {
      id: 1,
      outlet: "TechCrunch",
      title: "How ShopEase is Revolutionizing Online Shopping",
      date: "March 10, 2024",
      content: `ShopEase, the rapidly growing e-commerce platform, is making waves in the online retail space with its innovative approach to customer experience and technology integration.

The company's recent $50M Series B funding round has positioned it for aggressive expansion, with plans to enter European and Asian markets in 2024.

What sets ShopEase apart:
• AI-powered product recommendations
• Seamless mobile shopping experience
• Strategic brand partnerships
• Focus on customer satisfaction

Industry experts predict ShopEase could become a major player in the e-commerce landscape, potentially challenging established players like Amazon and Shopify.

"ShopEase understands that modern consumers want more than just products," said TechCrunch analyst Maria Santos. "They want an experience, and ShopEase delivers that in spades."`,
      link: "#"
    },
    {
      id: 2,
      outlet: "Forbes",
      title: "ShopEase: The Next Big Player in E-commerce",
      date: "February 25, 2024",
      content: `In the crowded e-commerce landscape, ShopEase is emerging as a serious contender with its customer-centric approach and innovative technology stack.

The company's recent partnerships with major brands like Nike, Apple, and Samsung have given it access to premium products and exclusive deals that are driving customer acquisition and retention.

Forbes spoke with several ShopEase customers who praised the platform's:
• Intuitive user interface
• Fast loading times
• Accurate product recommendations
• Responsive customer service

"ShopEase has cracked the code on what modern shoppers want," said Forbes contributor David Miller. "They're not just selling products; they're creating shopping experiences."

With a recent $50M funding round and plans for international expansion, ShopEase appears well-positioned for continued growth in the competitive e-commerce market.`,
      link: "#"
    },
    {
      id: 3,
      outlet: "The Wall Street Journal",
      title: "E-commerce Startups Adapt to Changing Consumer Behavior",
      date: "February 15, 2024",
      content: `As consumer shopping habits continue to evolve, e-commerce startups like ShopEase are adapting with innovative solutions that prioritize customer experience and convenience.

ShopEase's approach focuses on:
• Mobile-first design
• AI-powered personalization
• Fast and reliable delivery
• Seamless return processes

The Wall Street Journal analysis shows that ShopEase's customer retention rates are 40% higher than industry averages, with particularly strong performance among millennial and Gen Z shoppers.

"ShopEase understands that today's consumers expect more than just a transaction," said retail analyst Rachel Kim. "They want a relationship with the brands they shop with."

The company's recent funding and partnership announcements suggest it's well-capitalized for growth, with expansion plans that could see it competing directly with established e-commerce giants in the coming years.`,
      link: "#"
    }
  ];

  const handleReadArticle = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const downloadPressKit = () => {
    // Create a simple press kit content
    const pressKitContent = `ShopEase Press Kit
==================

Company Overview:
- Founded: 2022
- Headquarters: New York, NY
- CEO: Alex Chen
- Employees: 500+
- Markets: 50+ countries
- Customers: 10M+ users

Recent Achievements:
- $50M Series B funding (March 2024)
- 200% YoY growth (2023)
- 500+ brand partnerships
- 99.9% uptime guarantee

Media Contact:
Email: press@shopease.com
Phone: +1 (555) 123-4567

Brand Assets:
- Logo files available upon request
- Executive headshots available
- Product images and screenshots
- Company presentations

For media inquiries, please contact press@shopease.com`;

    // Create and download the file
    const blob = new Blob([pressKitContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ShopEase-Press-Kit.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
                <button
                  onClick={downloadPressKit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
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
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleReadArticle(release);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
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
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleReadArticle(article);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                >
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

      {/* Article Modal */}
      {showArticleModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h2>
                  <p className="text-gray-600">{selectedArticle.date}</p>
                </div>
                <button
                  onClick={() => setShowArticleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {selectedArticle.content}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowArticleModal(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PressPage;

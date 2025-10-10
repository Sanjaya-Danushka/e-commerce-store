import React, { useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const BlogPage = ({ cart }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [blogEmail, setBlogEmail] = useState("");
  const [blogIsLoading, setBlogIsLoading] = useState(false);

  const featuredPosts = [
    {
      id: 1,
      title: "The Future of E-commerce: Trends to Watch in 2024",
      excerpt: "Explore the emerging trends that are shaping the future of online shopping, from AI-powered personalization to sustainable practices.",
      author: "Sarah Johnson",
      date: "March 12, 2024",
      category: "Industry Insights",
      readTime: "5 min read",
      content: `The e-commerce landscape is evolving at an unprecedented pace, and 2024 promises to be a transformative year for online shopping. As we navigate this rapidly changing environment, several key trends are emerging that will reshape how consumers shop and how businesses operate.

## AI-Powered Personalization

Artificial Intelligence is revolutionizing the shopping experience by providing unprecedented levels of personalization. Advanced algorithms now analyze customer behavior, preferences, and purchase history to deliver highly targeted product recommendations.

Key developments include:
• Real-time product suggestions based on browsing patterns
• Predictive sizing and fit recommendations
• Automated styling suggestions for fashion items
• Smart gift recommendation engines

## Sustainability Takes Center Stage

Environmental consciousness is no longer a niche concern—it's becoming a core purchasing decision for millions of consumers. E-commerce platforms are responding with innovative sustainable practices:

• Carbon footprint tracking for deliveries
• Eco-friendly packaging alternatives
• Partnerships with sustainable brands
• Transparency in supply chain practices

## Mobile-First Commerce

With mobile commerce accounting for over 70% of e-commerce traffic, businesses are prioritizing mobile-first design and functionality. This includes:

• Progressive Web Apps (PWAs) for app-like experiences
• One-click purchasing capabilities
• Advanced mobile payment integrations
• Location-based personalized offers

## Social Commerce Integration

Social media platforms are becoming shopping destinations in their own right. The integration of shopping features within social apps is creating new opportunities for discovery and purchase.

## The Road Ahead

As we move through 2024, successful e-commerce businesses will be those that can adapt to these emerging trends while maintaining the core principles of customer satisfaction, convenience, and value. The future belongs to platforms that can seamlessly blend technology, sustainability, and human-centered design.`,
      image: "/images/blog/future-ecommerce.jpg"
    },
    {
      id: 2,
      title: "How to Choose the Perfect Tech Gadget for Your Needs",
      excerpt: "A comprehensive guide to selecting the right technology products, with tips from our expert reviewers and real customer experiences.",
      author: "Mike Chen",
      date: "March 8, 2024",
      category: "Buying Guides",
      readTime: "7 min read",
      content: `Choosing the perfect tech gadget can be overwhelming given the vast array of options available today. Whether you're looking for a new smartphone, laptop, or smart home device, making an informed decision requires careful consideration of your specific needs and priorities.

## Define Your Primary Use Case

Before diving into specifications and features, clearly identify how you'll primarily use the device:

**For Smartphones:**
• Photography enthusiasts need excellent cameras
• Gamers prioritize processing power and battery life
• Business users focus on productivity features and security
• Budget-conscious buyers look for value and longevity

## Set Your Budget and Research Value

Establish a realistic budget range and research devices within that price point. Consider the total cost of ownership including accessories and maintenance.

## Compare Key Specifications

Once you've narrowed down your options, compare critical specifications like processor speed, RAM, storage capacity, and display quality.

## Consider Ecosystem Integration

Think about how the device fits into your existing technology ecosystem and read reviews from real users for practical insights.

## Test Before You Buy

Whenever possible, test devices in person at stores to get hands-on experience with keyboards, displays, and overall feel.

## Make Your Decision

After thorough research, trust your analysis and make a confident decision. The key is patience and research—rushing into a purchase often leads to buyer's remorse.`,
      image: "/images/blog/tech-guide.jpg"
    }
  ];

  const recentPosts = [
    {
      id: 3,
      title: "Sustainable Shopping: Making Eco-Friendly Choices",
      excerpt: "Learn how to shop sustainably without compromising on quality or style.",
      author: "Emma Davis",
      date: "March 5, 2024",
      category: "Lifestyle",
      readTime: "4 min read",
      content: `Sustainable shopping involves making purchasing decisions that minimize environmental impact while supporting ethical business practices. This includes choosing products made from eco-friendly materials, supporting brands with transparent supply chains, and opting for durable, long-lasting items.

## Materials Matter

The environmental impact of a product often begins with its materials. Look for eco-friendly fabrics like organic cotton, bamboo, hemp, and recycled polyester. For packaging, choose biodegradable materials and FSC-certified paper products.

## Brand Transparency

Look for brands that provide clear information about manufacturing processes, labor practices, carbon footprint, and sustainability goals. Quality over quantity is key—invest in well-made, timeless pieces that last longer.

## Practical Shopping Tips

For clothing, choose natural fibers and look for GOTS certification. For electronics, research energy efficiency ratings and consider refurbished options. For home goods, opt for FSC-certified wood and recycled materials.

Every sustainable purchase contributes to reduced environmental footprint, support for ethical business practices, and long-term cost savings through durability. Start small, research brands, and build a collection of quality, sustainable items.`
    },
    {
      id: 4,
      title: "Behind the Scenes: How We Source Our Products",
      excerpt: "Take a look at our rigorous quality control and supplier selection process.",
      author: "David Wilson",
      date: "February 28, 2024",
      category: "Company",
      readTime: "6 min read",
      content: `At ShopEase, we believe that quality products are the foundation of exceptional customer experiences. Our rigorous sourcing and quality control processes ensure that every item we offer meets our exacting standards for quality, safety, and value.

## Our Sourcing Philosophy

We partner with suppliers who share our commitment to excellence and ethical business practices. Our sourcing team evaluates potential partners based on product quality, manufacturing capabilities, ethical labor practices, environmental responsibility, and innovation.

## The Supplier Selection Process

**Initial Screening:** We review company history, financial stability, manufacturing facilities, quality management systems, and compliance with international standards.

**On-Site Audits:** Selected suppliers undergo facility inspections, equipment checks, worker interviews, and process documentation review.

**Sample Testing:** We conduct material composition analysis, performance testing, safety verification, and comparative analysis.

## Quality Control Procedures

**Incoming Inspection:** Every shipment undergoes visual assessment, dimensional checks, material verification, and packaging evaluation.

**Laboratory Testing:** Select products undergo chemical analysis, performance testing, durability studies, and safety verification.

## Ethical Sourcing Standards

**Labor Practices:** We ensure fair wages, safe environments, no child labor, and respect for workers' rights.

**Environmental Responsibility:** Suppliers must comply with regulations, demonstrate waste reduction, energy efficiency, and sustainable resource management.

## Supplier Development Program

We help suppliers improve through technical training, quality management implementation, process optimization, and sustainability best practices.

## Transparency and Traceability

We maintain detailed records of raw material sources, manufacturing processes, quality checkpoints, and transportation. We provide transparent information about product composition, manufacturing locations, quality certifications, and sustainability initiatives.

## The Result

Our processes ensure products that meet industry standards, consistent quality, safe and reliable items, and value that justifies the investment.

## Continuous Improvement

We're always enhancing our processes through regular quality standard reviews, adoption of new testing technologies, expansion of supplier development programs, and integration of customer feedback.

Our commitment to quality sourcing builds lasting relationships with customers and supplier partners.`
    }
  ];

  const categories = [
    { name: "Technology", count: 24 },
    { name: "Fashion", count: 18 },
    { name: "Lifestyle", count: 32 },
    { name: "Buying Guides", count: 15 },
    { name: "Company News", count: 8 },
    { name: "Industry Insights", count: 12 }
  ];

  const handleReadArticle = (article) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const handleBlogSubscription = async (e) => {
    e.preventDefault();
    if (!blogEmail || !blogEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setBlogIsLoading(true);
    try {
      const response = await axios.post('/api/subscribe', { email: blogEmail });

      if (response.status === 200) {
        setBlogEmail('');
        alert('Thank you for subscribing to our blog! You\'ll receive the latest articles and insights.');
      }
    } catch (error) {
      console.error('Blog subscription error:', error);

      if (error.response && error.response.data && error.response.data.error) {
        alert(`Subscription failed: ${error.response.data.error}`);
      } else {
        alert('Subscription failed. Please try again.');
      }
    } finally {
      setBlogIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Blog - ShopEase</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">ShopEase Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover insights, trends, and tips to enhance your shopping experience and stay informed about the latest in e-commerce.
          </p>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">Get the latest articles and insights delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={blogEmail}
                onChange={(e) => setBlogEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                onClick={handleBlogSubscription}
                disabled={blogIsLoading}
                className={`bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors ${
                  blogIsLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {blogIsLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{post.category}</span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      By {post.author} • {post.date}
                    </div>
                    <button
                      onClick={() => handleReadArticle(post)}
                      className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Recent Posts & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Posts</h2>
            <div className="space-y-6">
              {recentPosts.map((post, index) => (
                <article key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{post.category}</span>
                        <span className="text-gray-500 text-xs">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          By {post.author} • {post.date}
                        </div>
                        <button
                          onClick={() => handleReadArticle(post)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                        >
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Categories */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <button className="text-gray-700 hover:text-blue-600 transition-colors">
                      {category.name}
                    </button>
                    <span className="text-gray-500 text-sm">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Articles</h3>
              <div className="space-y-4">
                {[
                  { title: "10 Must-Have Gadgets for Remote Work", views: "2.5K views" },
                  { title: "Sustainable Fashion Brands We're Loving", views: "1.8K views" },
                  { title: "Complete Guide to Smart Home Security", views: "3.2K views" },
                  { title: "Holiday Shopping Trends 2024", views: "4.1K views" }
                ].map((article, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                      {article.title}
                    </h4>
                    <span className="text-xs text-gray-500">{article.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow Us */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex space-x-3">
                {[
                  { name: "Twitter", icon: "🐦", color: "hover:text-blue-400" },
                  { name: "Facebook", icon: "📘", color: "hover:text-blue-600" },
                  { name: "Instagram", icon: "📷", color: "hover:text-pink-600" },
                  { name: "LinkedIn", icon: "💼", color: "hover:text-blue-700" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg ${social.color} transition-colors`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Never Miss a Post</h3>
              <p className="text-gray-600 text-sm mb-4">
                Subscribe to get the latest articles and insights delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email for updates"
                  value={blogEmail}
                  onChange={(e) => setBlogEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!blogEmail || !blogEmail.includes('@')) {
                      alert('Please enter a valid email address to subscribe');
                      return;
                    }
                    handleBlogSubscription(e);
                  }}
                  disabled={blogIsLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 text-sm ${
                    blogIsLoading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  {blogIsLoading ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </div>
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
                  <p className="text-gray-600">{selectedArticle.date} • By {selectedArticle.author}</p>
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

export default BlogPage;

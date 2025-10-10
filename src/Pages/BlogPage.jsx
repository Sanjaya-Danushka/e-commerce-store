import React from "react";
import Header from "../components/Header";

const BlogPage = ({ cart }) => {
  const featuredPosts = [
    {
      title: "The Future of E-commerce: Trends to Watch in 2024",
      excerpt: "Explore the emerging trends that are shaping the future of online shopping, from AI-powered personalization to sustainable practices.",
      author: "Sarah Johnson",
      date: "March 12, 2024",
      category: "Industry Insights",
      readTime: "5 min read",
      image: "/images/blog/future-ecommerce.jpg"
    },
    {
      title: "How to Choose the Perfect Tech Gadget for Your Needs",
      excerpt: "A comprehensive guide to selecting the right technology products, with tips from our expert reviewers and real customer experiences.",
      author: "Mike Chen",
      date: "March 8, 2024",
      category: "Buying Guides",
      readTime: "7 min read",
      image: "/images/blog/tech-guide.jpg"
    }
  ];

  const recentPosts = [
    {
      title: "Sustainable Shopping: Making Eco-Friendly Choices",
      excerpt: "Learn how to shop sustainably without compromising on quality or style.",
      author: "Emma Davis",
      date: "March 5, 2024",
      category: "Lifestyle",
      readTime: "4 min read"
    },
    {
      title: "Behind the Scenes: How We Source Our Products",
      excerpt: "Take a look at our rigorous quality control and supplier selection process.",
      author: "David Wilson",
      date: "February 28, 2024",
      category: "Company",
      readTime: "6 min read"
    },
    {
      title: "Smart Home Setup: Essential Devices for Modern Living",
      excerpt: "Transform your home with these must-have smart devices and integrations.",
      author: "Lisa Park",
      date: "February 25, 2024",
      category: "Technology",
      readTime: "8 min read"
    },
    {
      title: "Fashion Trends 2024: What's Hot This Season",
      excerpt: "Stay ahead of the fashion curve with our curated selection of trending styles.",
      author: "Rachel Kim",
      date: "February 20, 2024",
      category: "Fashion",
      readTime: "5 min read"
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
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
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
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
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
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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

            {/* Popular Tags */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["E-commerce", "Technology", "Fashion", "Sustainability", "Shopping Tips", "Product Reviews", "Trends", "Innovation"].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Never Miss a Post</h3>
              <p className="text-gray-600 text-sm mb-4">
                Subscribe to get the latest articles and insights delivered to your inbox.
              </p>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

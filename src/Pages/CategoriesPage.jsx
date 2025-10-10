import React from "react";
import Header from "../components/Header";
import { Link } from "react-router";

const CategoriesPage = ({ cart }) => {
  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      icon: '📱',
      description: 'Latest gadgets, smartphones, and tech accessories',
      itemCount: '2,500+ items',
      color: 'from-blue-500 to-indigo-600',
      subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Cameras', 'Gaming']
    },
    {
      id: 'fashion',
      name: 'Fashion & Clothing',
      icon: '👕',
      description: 'Trendy clothing, shoes, and fashion accessories',
      itemCount: '5,200+ items',
      color: 'from-purple-500 to-pink-600',
      subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Bags', 'Accessories', 'Jewelry']
    },
    {
      id: 'home',
      name: 'Home & Garden',
      icon: '🏠',
      description: 'Everything you need for your home and garden',
      itemCount: '1,800+ items',
      color: 'from-green-500 to-emerald-600',
      subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Garden Tools', 'Appliances']
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      icon: '⚽',
      description: 'Sports equipment, fitness gear, and outdoor essentials',
      itemCount: '3,100+ items',
      color: 'from-orange-500 to-red-600',
      subcategories: ['Fitness Equipment', 'Team Sports', 'Outdoor Gear', 'Water Sports', 'Winter Sports', 'Cycling']
    },
    {
      id: 'beauty',
      name: 'Beauty & Health',
      icon: '💄',
      description: 'Cosmetics, skincare, and wellness products',
      itemCount: '1,200+ items',
      color: 'from-pink-500 to-rose-600',
      subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Wellness', 'Personal Care']
    },
    {
      id: 'books',
      name: 'Books & Media',
      icon: '📚',
      description: 'Books, movies, music, and digital content',
      itemCount: '8,500+ items',
      color: 'from-indigo-500 to-purple-600',
      subcategories: ['Fiction Books', 'Non-Fiction', 'Textbooks', 'Movies', 'Music', 'E-books']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cart={cart} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Shop by Category
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Discover thousands of products across our carefully curated categories
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{category.icon}</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                {category.name}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {category.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {category.itemCount}
                </span>
                <span className="text-blue-600 group-hover:text-blue-800 font-medium">
                  Shop Now →
                </span>
              </div>

              {/* Subcategories preview */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <span key={sub} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

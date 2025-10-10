import React from "react";
import Header from "../components/Header";
import { Link } from "react-router";

const BrandsPage = ({ cart, wishlist }) => {
  const brands = [
    {
      id: 'nike',
      name: 'Nike',
      logo: 'nike',
      description: 'Just Do It - Athletic footwear, apparel, and sports equipment',
      productCount: '850+ products',
      specialty: 'Athletic & Sports',
      rating: 4.8,
      founded: '1971'
    },
    {
      id: 'adidas',
      name: 'Adidas',
      logo: 'adidas',
      description: 'Impossible is Nothing - Sport performance and lifestyle products',
      productCount: '720+ products',
      specialty: 'Sports & Lifestyle',
      rating: 4.7,
      founded: '1949'
    },
    {
      id: 'apple',
      name: 'Apple',
      logo: 'apple-logo',
      description: 'Think Different - Innovative technology and design',
      productCount: '320+ products',
      specialty: 'Technology & Innovation',
      rating: 4.9,
      founded: '1976'
    },
    {
      id: 'samsung',
      name: 'Samsung',
      logo: 'samsung',
      description: 'Do What You Can\'t - Global technology leader',
      productCount: '680+ products',
      specialty: 'Electronics & Mobile',
      rating: 4.6,
      founded: '1938'
    },
    {
      id: 'sony',
      name: 'Sony',
      logo: 'sony',
      description: 'Make. Believe - Entertainment and technology solutions',
      productCount: '450+ products',
      specialty: 'Entertainment & Audio',
      rating: 4.7,
      founded: '1946'
    },
    {
      id: 'dell',
      name: 'Dell',
      logo: 'dell',
      description: 'The Power to Do More - Computing technology and services',
      productCount: '290+ products',
      specialty: 'Computers & IT',
      rating: 4.5,
      founded: '1984'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cart={cart} wishlist={wishlist} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Shop by Brand
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Discover authentic products from your favorite world-class brands
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.id}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 transform hover:-translate-y-2 border border-gray-100 hover:border-purple-200"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={`/images/logos/${brand.logo}.png`}
                    alt={`${brand.name} Logo`}
                    className="h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="text-3xl" style={{display: 'none'}}>
                    🏢
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                  {brand.name}
                </h3>

                <div className="flex items-center justify-center space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= brand.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({brand.rating})</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed text-center">
                {brand.description}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Products:</span>
                  <span className="text-sm font-medium text-green-600">{brand.productCount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Specialty:</span>
                  <span className="text-sm font-medium text-blue-600">{brand.specialty}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Founded:</span>
                  <span className="text-sm font-medium text-purple-600">{brand.founded}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <span className="text-purple-600 group-hover:text-purple-800 font-medium">
                    Shop {brand.name} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;

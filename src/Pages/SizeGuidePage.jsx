import React from "react";
import Header from "../components/Header";

const SizeGuidePage = ({ cart }) => {
  const sizeCharts = {
    men: {
      title: "Men's Clothing",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      measurements: {
        chest: [33, 35, 37, 39, 41, 43],
        waist: [27, 29, 31, 33, 35, 37],
        inseam: [30, 30, 31, 31, 32, 32]
      }
    },
    women: {
      title: "Women's Clothing",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      measurements: {
        bust: [31, 33, 35, 37, 39, 41],
        waist: [23, 25, 27, 29, 31, 33],
        hips: [33, 35, 37, 39, 41, 43]
      }
    },
    shoes: {
      title: "Shoe Sizes",
      sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
      measurements: {
        us: [5, 6, 7, 8, 9, 10, 11, 12],
        uk: [3, 4, 5, 6, 7, 8, 9, 10],
        eu: [36, 37, 38, 39, 40, 41, 42, 43]
      }
    }
  };

  const measurementTips = [
    {
      title: "Chest/Bust",
      description: "Measure around the fullest part of your chest/bust, keeping the tape level",
      icon: "👕"
    },
    {
      title: "Waist",
      description: "Measure around your natural waistline, keeping the tape comfortably loose",
      icon: "👖"
    },
    {
      title: "Hips",
      description: "Measure around the fullest part of your hips, about 8 inches below your waist",
      icon: "👗"
    },
    {
      title: "Inseam",
      description: "Measure from the crotch seam to the bottom of the leg along the inside seam",
      icon: "📏"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Size Guide - ShopEase</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Size Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find your perfect fit with our comprehensive size charts and measurement guides.
          </p>
        </div>

        {/* Measurement Tips */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Measure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {measurementTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="text-3xl">{tip.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Size Charts */}
        <div className="space-y-16">
          {/* Men's Clothing */}
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{sizeCharts.men.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Size</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Chest (inches)</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Waist (inches)</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Inseam (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts.men.sizes.map((size, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-900">{size}</td>
                      <td className="py-4 px-4 text-gray-600">{sizeCharts.men.measurements.chest[index]}"</td>
                      <td className="py-4 px-4 text-gray-600">{sizeCharts.men.measurements.waist[index]}"</td>
                      <td className="py-4 px-4 text-gray-600">{sizeCharts.men.measurements.inseam[index]}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Women's Clothing */}
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{sizeCharts.women.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Size</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Bust (inches)</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Waist (inches)</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Hips (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts.women.sizes.map((size, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-900">{size}</td>
                      <td className="py-4 px-4 text-gray-600">{sizeCharts.women.measurements.bust[index]}"</td>
                      <td className="py-4 px-4 text-gray-600">{sizeCharts.women.measurements.waist[index]}"</td>
                      <td className="py-4 px-4 text-gray-600">{sizeCharts.women.measurements.hips[index]}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shoe Sizes */}
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{sizeCharts.shoes.title}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">US Size</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">UK Size</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">EU Size</th>
                    <th className="text-left py-4 px-4 text-gray-900 font-semibold">Foot Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts.shoes.sizes.map((size, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-900">{sizeCharts.shoes.measurements.us[index]}</td>
                      <td className="py-4 px-4 text-gray-600">{sizeCharts.shoes.measurements.uk[index]}</td>
                      <td className="py-4 px-4 text-gray-600">{sizeCharts.shoes.measurements.eu[index]}</td>
                      <td className="py-4 px-4 text-gray-600">{8.5 + index * 0.5}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Size Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Size Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Measure Carefully</h3>
              <p className="text-gray-600">Take measurements over undergarments for the most accurate sizing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Fit Preferences</h3>
              <p className="text-gray-600">Consider if you prefer loose, regular, or slim fit when selecting sizes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Variations</h3>
              <p className="text-gray-600">Different brands may have slight size variations - use our charts as a guide</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our sizing experts are here to help you find the perfect fit for any item.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
              Size Consultation
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;

import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
const SizeGuidePage = ({ cart }) => {
  const navigate = useNavigate();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [preferredFit, setPreferredFit] = useState("Regular Fit");
  const [sizeRecommendation, setSizeRecommendation] = useState(null);

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

  const getSizeRecommendation = () => {
    if (!height || !weight) {
      alert('Please enter both height and weight to get a size recommendation');
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (heightNum < 140 || heightNum > 220) {
      alert('Please enter a valid height between 140-220 cm');
      return;
    }

    if (weightNum < 30 || weightNum > 200) {
      alert('Please enter a valid weight between 30-200 kg');
      return;
    }

    // Simple size recommendation logic based on height and weight
    let recommendedSize = 'M'; // Default

    if (preferredFit === 'Slim Fit') {
      if (heightNum < 165 || weightNum < 55) recommendedSize = 'XS';
      else if (heightNum < 175 || weightNum < 70) recommendedSize = 'S';
      else if (heightNum < 185 || weightNum < 85) recommendedSize = 'M';
      else if (heightNum < 195 || weightNum < 100) recommendedSize = 'L';
      else recommendedSize = 'XL';
    } else if (preferredFit === 'Regular Fit') {
      if (heightNum < 160 || weightNum < 50) recommendedSize = 'XS';
      else if (heightNum < 170 || weightNum < 65) recommendedSize = 'S';
      else if (heightNum < 180 || weightNum < 80) recommendedSize = 'M';
      else if (heightNum < 190 || weightNum < 95) recommendedSize = 'L';
      else recommendedSize = 'XL';
    } else if (preferredFit === 'Loose Fit') {
      if (heightNum < 155 || weightNum < 45) recommendedSize = 'XS';
      else if (heightNum < 165 || weightNum < 60) recommendedSize = 'S';
      else if (heightNum < 175 || weightNum < 75) recommendedSize = 'M';
      else if (heightNum < 185 || weightNum < 90) recommendedSize = 'L';
      else recommendedSize = 'XL';
    } else if (preferredFit === 'Oversized') {
      if (heightNum < 150 || weightNum < 40) recommendedSize = 'XS';
      else if (heightNum < 160 || weightNum < 55) recommendedSize = 'S';
      else if (heightNum < 170 || weightNum < 70) recommendedSize = 'M';
      else if (heightNum < 180 || weightNum < 85) recommendedSize = 'L';
      else recommendedSize = 'XL';
    }

    setSizeRecommendation({
      size: recommendedSize,
      fit: preferredFit,
      height: heightNum,
      weight: weightNum
    });
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

        {/* Size Consultation Section */}
        <div id="size-consultation" className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Size Consultation</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Size Consultation</h3>
                <p className="text-gray-600 mb-6">
                  Get personalized sizing advice from our experts. Tell us about your measurements and preferences, and we'll help you find the perfect fit.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    One-on-one sizing advice
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Brand-specific recommendations
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Fit preference guidance
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Size Finder</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="170"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="65"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Fit</label>
                    <select
                      value={preferredFit}
                      onChange={(e) => setPreferredFit(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>Slim Fit</option>
                      <option>Regular Fit</option>
                      <option>Loose Fit</option>
                      <option>Oversized</option>
                    </select>
                  </div>
                  <button
                    onClick={getSizeRecommendation}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Get Size Recommendation
                  </button>
                </div>
              </div>
            </div>

            {/* Size Recommendation Results */}
            {sizeRecommendation && (
              <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Your Size Recommendation</h3>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
                    <span className="text-2xl font-bold text-white">{sizeRecommendation.size}</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Recommended Size: <span className="text-green-600">{sizeRecommendation.size}</span>
                  </p>
                  <p className="text-gray-600 mb-2">Fit Preference: {sizeRecommendation.fit}</p>
                  <p className="text-sm text-gray-500">
                    Based on {sizeRecommendation.height}cm height and {sizeRecommendation.weight}kg weight
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our sizing experts are here to help you find the perfect fit for any item.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const consultationSection = document.getElementById('size-consultation');
                if (consultationSection) {
                  consultationSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Size Consultation
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;

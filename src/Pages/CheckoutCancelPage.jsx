import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const CheckoutCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Cancel Header */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-pink-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6 mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Cancelled</h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Your payment was cancelled. No charges were made to your account.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  You can try again with a different payment method or contact us if you need help.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Need help? <a href="/contact" className="text-blue-600 hover:text-blue-800">Contact our support team</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;

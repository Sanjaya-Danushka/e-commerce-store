import React from "react";
import Header from "../components/Header";

const TermsPage = ({ cart }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <title>Terms of Service</title>
      <Header cart={cart} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="mb-8">
            <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </a>
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: October 10, 2024</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using ShopEase ("we," "us," or "our"), you accept and agree to be bound by the terms
              and provision of this agreement. These Terms of Service constitute the entire agreement between you and
              ShopEase regarding the use of our website and services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="mb-6">
              Permission is granted to temporarily download one copy of the materials on ShopEase's website for
              personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
              and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times.
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Products and Services</h2>
            <p className="mb-6">
              We reserve the right to modify, suspend, or discontinue any product or service at any time without notice.
              We shall not be liable to you or any third party for any modification, suspension, or discontinuance of our products or services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pricing and Payment</h2>
            <p className="mb-6">
              All prices are subject to change without notice. We accept major credit cards and other payment methods as indicated.
              Payment is due at the time of purchase. All taxes and shipping charges will be added to your total as applicable.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Shipping and Delivery</h2>
            <p className="mb-6">
              We will make every effort to deliver your order within the estimated timeframe. However, delivery dates are estimates only.
              We are not responsible for delays caused by shipping carriers or other circumstances beyond our control.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns and Exchanges</h2>
            <p className="mb-6">
              We offer a 30-day return policy for most items. Items must be returned in their original condition with all packaging and documentation.
              Some items may not be eligible for return. Please check our Return Policy for complete details.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="mb-6">
              In no event shall ShopEase or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
              or due to business interruption) arising out of the use or inability to use the materials on ShopEase's website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy Policy</h2>
            <p className="mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service,
              to understand our practices regarding the collection and use of your personal information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <p className="mb-6">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability,
              under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material,
              we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="mb-6">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> legal@shopease.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Commerce Street, Business District, New York, NY 10001</p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                By using ShopEase, you acknowledge that you have read these Terms of Service,
                understand them, and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

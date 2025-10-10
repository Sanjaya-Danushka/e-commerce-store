import React from "react";
import Header from "../components/Header";

const TermsPage = ({ cart }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <title>Terms of Service - ShopEase</title>
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-xl text-gray-600">
              Last updated: March 15, 2024
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using ShopEase's services, you accept and agree to be bound by the terms and provision of this agreement.
              Please read these Terms of Service carefully before using our platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of ShopEase's materials for personal, non-commercial transitory viewing only.
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide accurate, complete, and current information at all times.
            </p>
            <p className="mb-6">
              You are responsible for safeguarding the password and for all activities that occur under your account.
              You agree not to disclose your password to any third party.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Product Information</h2>
            <p className="mb-6">
              We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions,
              pricing, or other content is accurate, complete, reliable, current, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Pricing and Payments</h2>
            <p className="mb-4">
              All prices are subject to change without notice. We accept major credit cards and digital payment methods.
            </p>
            <p className="mb-6">
              Payment processing is handled securely through our certified payment partners.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Shipping and Delivery</h2>
            <p className="mb-4">
              We offer various shipping options with different delivery timeframes and costs.
            </p>
            <p className="mb-6">
              Delivery dates are estimates and not guaranteed. Risk of loss passes to buyer upon delivery to carrier.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns and Refunds</h2>
            <p className="mb-4">
              We offer a 30-day return policy for most items in new, unused condition with original packaging.
            </p>
            <p className="mb-6">
              Refunds will be processed to the original payment method within 5-10 business days after receipt of returned items.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="mb-6">
              ShopEase shall not be liable for any special or consequential damages that result from the use of,
              or inability to use, the materials on this site.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. User Conduct</h2>
            <p className="mb-4">
              You agree not to use the service to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Violate any local, state, national, or international law or regulation</li>
              <li>Transmit any material that is unlawful, harmful, threatening, or abusive</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <p className="mb-6">
              We may terminate or suspend your account immediately, without prior notice or liability,
              for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="mb-6">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>📧 legal@shopease.com</p>
              <p>📞 1-800-LEGAL-HELP</p>
              <p>📍 123 Commerce Street, New York, NY 10001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

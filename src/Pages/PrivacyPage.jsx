import React from "react";
import Header from "../components/Header";

const PrivacyPage = ({ cart }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <title>Privacy Policy</title>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: October 10, 2024</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              At ShopEase ("we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="mb-4">We may collect personal information that you voluntarily provide to us, including:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Name and contact information (email address, phone number, shipping address)</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Account credentials (username, password)</li>
              <li>Order history and preferences</li>
              <li>Communications with our customer service team</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
            <p className="mb-6">When you visit our website, we may automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="mb-6">We use the collected information for various purposes, including:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Processing and fulfilling your orders</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Personalizing your shopping experience</li>
              <li>Sending order confirmations and shipping notifications</li>
              <li>Improving our website and services</li>
              <li>Sending marketing communications (with your consent)</li>
              <li>Preventing fraud and ensuring security</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
            <p className="mb-6">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our website and fulfilling orders</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access,
              alteration, disclosure, or destruction. This includes encryption of sensitive data and regular security assessments.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="mb-6">
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content.
              You can control cookie settings through your browser preferences. However, disabling cookies may affect website functionality.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            <p className="mb-6">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Access:</strong> Request information about the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="mb-6">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable
              data protection laws and implement appropriate safeguards to protect your information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p><strong>Email:</strong> privacy@shopease.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Commerce Street, Business District, New York, NY 10001</p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                By using ShopEase, you consent to the collection and use of your information as described in this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;

import React from "react";
import Header from "../components/Header";

const AccessibilityPage = ({ cart }) => {
  const accessibilityFeatures = [
    {
      title: "Keyboard Navigation",
      description: "All interactive elements are accessible via keyboard navigation",
      icon: "⌨️"
    },
    {
      title: "Screen Reader Support",
      description: "Proper ARIA labels and semantic HTML for screen readers",
      icon: "🔊"
    },
    {
      title: "High Contrast Mode",
      description: "Color combinations meet WCAG contrast requirements",
      icon: "🎨"
    },
    {
      title: "Text Scaling",
      description: "Content remains readable when text is enlarged up to 200%",
      icon: "🔍"
    },
    {
      title: "Alternative Text",
      description: "All images include descriptive alternative text",
      icon: "🖼️"
    },
    {
      title: "Focus Indicators",
      description: "Clear visual indicators for keyboard focus",
      icon: "🎯"
    }
  ];

  const accessibilityStandards = [
    {
      standard: "WCAG 2.1 AA",
      description: "Web Content Accessibility Guidelines Level AA compliance",
      status: "Compliant"
    },
    {
      standard: "Section 508",
      description: "US Federal accessibility requirements",
      status: "Compliant"
    },
    {
      standard: "ADA",
      description: "Americans with Disabilities Act compliance",
      status: "Compliant"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Accessibility - ShopEase</title>
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Accessibility Statement</h1>
            <p className="text-xl text-gray-600">
              ShopEase is committed to ensuring digital accessibility for all users, including those with disabilities.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="mb-6">
              ShopEase strives to provide an accessible shopping experience for everyone. We are continually improving
              the user experience for all visitors and applying relevant accessibility standards to ensure we provide
              equal access to all users.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {accessibilityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-700 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Standards Compliance</h2>
            <div className="mb-8">
              {accessibilityStandards.map((standard, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{standard.standard}</h3>
                    <p className="text-gray-600 text-sm">{standard.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {standard.status}
                  </span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assistive Technology Support</h2>
            <p className="mb-4">
              Our website is designed to work with:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Voice recognition software (Dragon NaturallySpeaking)</li>
              <li>Keyboard-only navigation</li>
              <li>Zoom software (up to 200% magnification)</li>
              <li>High contrast mode</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback and Support</h2>
            <p className="mb-4">
              We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers,
              please let us know:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Accessibility Support</h3>
              <div className="space-y-2 text-gray-700">
                <p>📧 accessibility@shopease.com</p>
                <p>📞 1-800-ACCESSIBILITY</p>
                <p>💬 Live chat available 24/7</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Accessibility Testing</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Regular automated accessibility scans</li>
                <li>Manual testing with assistive technologies</li>
                <li>User testing with people with disabilities</li>
                <li>Continuous monitoring and updates</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Known Issues</h2>
            <p className="mb-4">
              We are aware of the following accessibility considerations:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Some third-party content may not be fully accessible</li>
              <li>PDF documents are being updated for better accessibility</li>
              <li>Mobile app accessibility is continuously improving</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates and Improvements</h2>
            <p className="mb-6">
              This accessibility statement was last updated on March 15, 2024. We continuously monitor and improve
              our website's accessibility and will update this statement as improvements are made.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPage;

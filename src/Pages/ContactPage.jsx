import React, { useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const ContactPage = ({ cart }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "chat" or "callback"
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [chatFormData, setChatFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    message: ''
  });

  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleChatFormChange = (e) => {
    setChatFormData({
      ...chatFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      const response = await axios.post('/api/contact', formData);

      if (response.status === 200) {
        setSubmitMessage(response.data.message || 'Thank you for your message! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/contact/chat-request', chatFormData);

      if (response.status === 200) {
        setSubmitMessage('Chat request submitted! Our team will contact you shortly.');
        setShowModal(false);
        setChatFormData({ name: '', email: '', phone: '', preferredTime: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting chat request:', error);
      setSubmitError(error.response?.data?.error || 'Failed to submit chat request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = () => {
    setModalType("chat");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitMessage('');
    setSubmitError('');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <title>Contact Us</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have a question, feedback, or need help? We'd love to hear from you.
            Our team is here to help make your shopping experience exceptional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="orders">Order Questions</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>

              {submitMessage && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">{submitMessage}</p>
                </div>
              )}

              {submitError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{submitError}</p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      123 Commerce Street<br />
                      Business District<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">support@shopease.com</p>
                    <p className="text-gray-600">business@shopease.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Chat Support</h3>
              <p className="text-gray-600 mb-6">
                Need immediate help? Our customer support team is available 24/7 via live chat.
              </p>
              <button
                onClick={handleStartChat}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Start Live Chat
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does shipping take?</h3>
              <p className="text-gray-600">
                Standard shipping takes 3-5 business days, while express shipping arrives in 1-2 business days.
                Free shipping is available on orders over $50.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's your return policy?</h3>
              <p className="text-gray-600">
                We offer a 30-day return policy on all items. Items must be in original condition with tags attached.
                Return shipping is free for defective items.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer international shipping?</h3>
              <p className="text-gray-600">
                Yes! We ship to over 100 countries worldwide. International shipping rates and delivery times vary by location.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How can I track my order?</h3>
              <p className="text-gray-600">
                Once your order ships, you'll receive a tracking number via email. You can also track your order
                in your account dashboard or contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalType === "chat" ? "Start Live Chat" : "Request Callback"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {modalType === "chat" ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">Live Chat Request</h3>
                    <p className="text-blue-800 mb-4">
                      Request a live chat session with our customer support team. We'll connect you with an available representative.
                    </p>
                  </div>

                  <form onSubmit={handleChatSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={chatFormData.name}
                          onChange={handleChatFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your Full Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={chatFormData.email}
                          onChange={handleChatFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={chatFormData.phone}
                          onChange={handleChatFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Time
                        </label>
                        <select
                          name="preferredTime"
                          value={chatFormData.preferredTime}
                          onChange={handleChatFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select preferred time</option>
                          <option value="now">Right Now</option>
                          <option value="15min">In 15 minutes</option>
                          <option value="30min">In 30 minutes</option>
                          <option value="1hour">In 1 hour</option>
                          <option value="callback">Request Callback</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={chatFormData.message}
                        onChange={handleChatFormChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Brief description of your question..."
                      />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          isLoading
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        {isLoading ? 'Submitting...' : 'Request Chat'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-green-900 mb-3">Callback Request</h3>
                    <p className="text-green-800 mb-4">
                      Request a callback from our customer support team. We'll call you back within 2 hours during business hours.
                    </p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChatSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={chatFormData.name}
                          onChange={handleChatFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your Full Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={chatFormData.email}
                          onChange={handleChatFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={chatFormData.phone}
                          onChange={handleChatFormChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Time
                        </label>
                        <select
                          name="preferredTime"
                          value={chatFormData.preferredTime}
                          onChange={handleChatFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select preferred time</option>
                          <option value="asap">As soon as possible</option>
                          <option value="morning">Morning (9AM - 12PM)</option>
                          <option value="afternoon">Afternoon (12PM - 3PM)</option>
                          <option value="evening">Evening (3PM - 6PM)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Callback
                      </label>
                      <textarea
                        name="message"
                        value={chatFormData.message}
                        onChange={handleChatFormChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Brief description of why you need a callback..."
                      />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          isLoading
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                        }`}
                      >
                        {isLoading ? 'Submitting...' : 'Request Callback'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;

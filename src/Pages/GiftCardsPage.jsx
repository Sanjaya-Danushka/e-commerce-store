import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GiftCardsPage = ({ cart }) => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(1);

  const giftCardAmounts = [25, 50, 75, 100, 150, 200];

  const giftCardDesigns = [
    {
      id: 1,
      name: "Classic Blue",
      preview: "🎁",
      description: "Timeless design perfect for any occasion"
    },
    {
      id: 2,
      name: "Birthday Surprise",
      preview: "🎂",
      description: "Celebrate special moments with style"
    },
    {
      id: 3,
      name: "Holiday Magic",
      preview: "🎄",
      description: "Festive design for holiday gifting"
    },
    {
      id: 4,
      name: "Thank You",
      preview: "🙏",
      description: "Show appreciation with elegance"
    }
  ];

  const handlePurchase = async (e) => {
    e.preventDefault();

    // Validate form
    if (!recipientEmail || !recipientEmail.includes('@')) {
      alert('Please enter a valid recipient email address');
      return;
    }

    if (!senderName.trim()) {
      alert('Please enter your name');
      return;
    }

    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount < 10) {
      alert('Please select or enter a valid amount (minimum $10)');
      return;
    }

    setIsLoading(true);

    try {
      // Send gift card email using existing email system
      const response = await axios.post('/api/subscribe', {
        email: recipientEmail,
        isGiftCard: true,
        giftCard: {
          amount: amount,
          senderName: senderName,
          message: message,
          design: selectedDesign
        }
      });

      if (response.status === 200) {
        // Reset form
        setRecipientEmail('');
        setSenderName('');
        setMessage('');
        setSelectedAmount(50);
        setCustomAmount('');
        setSelectedDesign(1);

        alert(`Gift card for $${amount} sent successfully to ${recipientEmail}!`);
      }
    } catch (error) {
      console.error('Gift card purchase error:', error);

      if (error.response && error.response.data && error.response.data.error) {
        alert(`Gift card purchase failed: ${error.response.data.error}`);
      } else {
        alert('Gift card purchase failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Gift Cards - ShopEase</title>
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Gift Cards</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Give the perfect gift with ShopEase gift cards. Let your loved ones choose from millions of products.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gift Card Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Purchase Gift Card</h2>

          <form onSubmit={handlePurchase}>
            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Amount</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {giftCardAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      selectedAmount === amount
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">Custom Amount:</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount("");
                  }}
                  placeholder="Enter amount"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="10"
                  max="1000"
                />
              </div>
            </div>

            {/* Gift Card Design */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Design</h3>
              <div className="grid grid-cols-2 gap-4">
                {giftCardDesigns.map((design) => (
                  <div
                    key={design.id}
                    onClick={() => setSelectedDesign(design.id)}
                    className={`border-2 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all duration-300 ${
                      selectedDesign === design.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{design.preview}</div>
                      <h4 className="font-medium text-gray-900">{design.name}</h4>
                      <p className="text-sm text-gray-600">{design.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipient Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
              }`}
            >
              {isLoading ? 'Sending Gift Card...' : `Purchase Gift Card - $${(selectedAmount || customAmount || 0)}`}
            </button>
          </form>
          </div>

          {/* Gift Card Information */}
          <div className="space-y-8">
            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose ShopEase Gift Cards?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Delivery</h3>
                    <p className="text-gray-600">Gift cards delivered via email within minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">No Expiration</h3>
                    <p className="text-gray-600">Gift cards never expire and can be used anytime</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy to Use</h3>
                    <p className="text-gray-600">Simple redemption process at checkout</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Redeem */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Redeem</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Add to Cart</h3>
                    <p className="text-gray-600">Add desired items to your shopping cart</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Enter Gift Card Code</h3>
                    <p className="text-gray-600">Enter the gift card code at checkout</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complete Purchase</h3>
                    <p className="text-gray-600">Gift card amount applied to your order total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms & Conditions</h2>
              <div className="space-y-3 text-gray-600 text-sm">
                <p>• Gift cards are non-refundable and cannot be redeemed for cash</p>
                <p>• Gift cards can be used multiple times until the balance is depleted</p>
                <p>• Lost or stolen gift cards cannot be replaced</p>
                <p>• Gift cards are valid for 5 years from date of purchase</p>
                <p>• Cannot be used to purchase other gift cards</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help Choosing?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our gift card specialists can help you find the perfect gift card for any occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Gift Card Help
            </button>
            <button
              onClick={() => {
                // Scroll to examples section or show examples
                const examplesSection = document.getElementById('gift-card-examples');
                if (examplesSection) {
                  examplesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-300"
            >
              View Examples
            </button>
          </div>
        </div>

        {/* Gift Card Examples Section */}
        <div id="gift-card-examples" className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Gift Card Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Birthday Surprise",
                description: "Perfect for celebrating someone's special day",
                amount: "$50",
                design: "Birthday",
                occasion: "Birthday"
              },
              {
                title: "Thank You Gesture",
                description: "Show appreciation with a thoughtful gift",
                amount: "$25",
                design: "Thank You",
                occasion: "Thank You"
              },
              {
                title: "Holiday Cheer",
                description: "Spread joy during the festive season",
                amount: "$100",
                design: "Holiday",
                occasion: "Holiday"
              },
              {
                title: "Just Because",
                description: "A sweet surprise for no particular reason",
                amount: "$75",
                design: "Classic",
                occasion: "Any Occasion"
              },
              {
                title: "Congratulations",
                description: "Celebrate achievements and milestones",
                amount: "$150",
                design: "Classic",
                occasion: "Congratulations"
              },
              {
                title: "Wedding Gift",
                description: "Help the happy couple start their new life",
                amount: "$200",
                design: "Classic",
                occasion: "Wedding"
              }
            ].map((example, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl ${
                    example.design === 'Birthday' ? 'bg-yellow-100' :
                    example.design === 'Thank You' ? 'bg-green-100' :
                    example.design === 'Holiday' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {example.design === 'Birthday' ? '🎂' :
                     example.design === 'Thank You' ? '🙏' :
                     example.design === 'Holiday' ? '🎄' : '🎁'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{example.occasion}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-600 text-sm">{example.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-lg font-bold text-green-600">{example.amount}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      example.design === 'Birthday' ? 'bg-yellow-100 text-yellow-800' :
                      example.design === 'Thank You' ? 'bg-green-100 text-green-800' :
                      example.design === 'Holiday' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {example.design}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardsPage;

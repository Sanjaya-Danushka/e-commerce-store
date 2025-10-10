import React, { useState } from "react";
import Header from "../components/Header";

const GiftCardsPage = ({ cart }) => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");

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

  const handlePurchase = (e) => {
    e.preventDefault();
    // Mock gift card purchase
    alert(`Gift card for $${selectedAmount || customAmount} sent successfully!`);
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

            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Amount</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {giftCardAmounts.map((amount) => (
                  <button
                    key={amount}
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
                  <div key={design.id} className="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all duration-300">
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
              onClick={handlePurchase}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300"
            >
              Purchase Gift Card - ${(selectedAmount || customAmount || 0)}
            </button>
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
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
              Gift Card Help
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-300">
              View Examples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardsPage;

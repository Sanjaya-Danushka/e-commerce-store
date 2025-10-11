import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Chatbot = ({ products = [] }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! I\'m your shopping assistant. I can help you find products, navigate the site, check your cart, and much more! What can I help you with today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Navigation helper
  const navigateTo = (path) => {
    navigate(path);
    setIsOpen(false); // Close chat after navigation
  };

  // Quick actions for common requests
  const quickActions = [
    { label: 'Browse Products', action: 'products', path: '/products' },
    { label: 'View Categories', action: 'categories', path: '/categories' },
    { label: 'Check Cart', action: 'cart', path: '/checkout' },
    { label: 'My Orders', action: 'orders', path: '/orders' },
  ];

  // Enhanced query categorization
  const categorizeQuery = (query) => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('help') || lowerQuery.includes('how') || lowerQuery.includes('what')) {
      return 'help';
    }
    if (lowerQuery.includes('product') || lowerQuery.includes('recommend') || lowerQuery.includes('suggest') || lowerQuery.includes('find') || lowerQuery.includes('show me')) {
      return 'product';
    }
    if (lowerQuery.includes('cart') || lowerQuery.includes('add') || lowerQuery.includes('buy') || lowerQuery.includes('checkout')) {
      return 'cart';
    }
    if (lowerQuery.includes('order') || lowerQuery.includes('track') || lowerQuery.includes('delivery') || lowerQuery.includes('purchase')) {
      return 'order';
    }
    if (lowerQuery.includes('category') || lowerQuery.includes('brand') || lowerQuery.includes('type') || lowerQuery.includes('section')) {
      return 'category';
    }
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('expensive') || lowerQuery.includes('cheap') || lowerQuery.includes('budget')) {
      return 'price';
    }
    if (lowerQuery.includes('go to') || lowerQuery.includes('take me') || lowerQuery.includes('visit') || lowerQuery.includes('open')) {
      return 'navigation';
    }
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey') || lowerQuery.includes('thanks')) {
      return 'greeting';
    }
    return 'general';
  };

  // Enhanced response generation with actions
  const generateResponse = (query, category) => {
    const responses = {
      greeting: [
        'Hello! Great to see you! How can I assist you with your shopping today?',
        'Hi there! I\'m here to help you find the perfect products. What are you looking for?',
        'Hey! Ready to discover some amazing deals? I can help you find exactly what you need!'
      ],
      help: [
        'I can help you with:\n• 🔍 Finding specific products\n• 🛒 Cart and checkout assistance\n• 📦 Order tracking\n• 🏷️ Browsing categories\n• 💰 Price comparisons\n• 🗺️ Site navigation\n\nWhat would you like help with?',
        'Here\'s what I can do for you:\n\n🔍 Find products and recommendations\n🛒 Help with your cart\n📦 Track orders and deliveries\n🏷️ Browse categories\n💰 Compare prices\n🗺️ Navigate to any page\n\nJust tell me what you need!'
      ],
      navigation: [
        'I can take you to any page! Here are some quick options:',
        'Let me help you navigate! Try asking:\n• "Go to products" - Browse all items\n• "Show me categories" - Explore sections\n• "Check my cart" - View your items\n• "My orders" - Track purchases'
      ],
      product: [
        `I found ${Math.min(5, products.length)} great products! Here are my top recommendations:\n\n${products.slice(0, 5).map((p, i) => `${i+1}. **${p.name}**\n   💰 ${formatMoney(p.priceCents)}\n   ⭐ ${p.rating?.stars || 'N/A'} stars (${p.rating?.count || 0} reviews)`).join('\n\n')}\n\nWould you like to see more details about any of these?`,
        `Based on our current inventory, here are some popular items:\n\n${products.slice(0, 3).map((p) => `• **${p.name}** - ${formatMoney(p.priceCents)}`).join('\n')}\n\nI can show you more if you'd like!`
      ],
      category: [
        'We have several great categories:\n📱 **Electronics** - Latest gadgets\n👕 **Fashion** - Trendy clothing\n🏠 **Home & Garden** - Everything for your space\n⚽ **Sports** - Gear for action\n\nEach category has amazing products! Which one interests you most?',
        'Our main categories are:\n• Electronics - Latest gadgets\n• Fashion - Trendy clothing\n• Home & Garden - Everything for your space\n• Sports - Gear for action\n\nWhat type of products are you looking for?'
      ],
      price: [
        `Our price range varies! Here are some examples:\n${products.slice(0, 3).map(p => `• **${p.name}**: ${formatMoney(p.priceCents)}`).join('\n')}\n\nWe have options for every budget!`,
        `Prices start from around ${formatMoney(Math.min(...products.map(p => p.priceCents)))} and go up to ${formatMoney(Math.max(...products.map(p => p.priceCents)))}. I can help you find products in your budget range!`
      ],
      cart: [
        'I can help you with your cart! You can add items to cart from any product page, or I can guide you to the checkout process. Would you like help with adding specific items?',
        'Cart assistance is easy! Just click "Add to Cart" on any product, or let me know what you\'re interested in and I can guide you through the process.'
      ],
      order: [
        'For order tracking, you can visit the "Orders" page in your account, or use the tracking page directly. I can help guide you to the right place!',
        'Order and delivery questions? I can help! You can track orders from your account dashboard, or let me know your order number and I can provide guidance.'
      ],
      general: [
        'I\'m here to help with all your shopping needs! You can ask me about products, recommendations, cart help, orders, or anything else related to our store.',
        'Not sure where to start? I can help you discover products, compare prices, find deals, or answer any questions you have about shopping with us!'
      ]
    };

    const categoryResponses = responses[category] || responses.general;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  // Format money helper
  const formatMoney = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    setShowQuickActions(false);

    // Categorize query and generate response
    const category = categorizeQuery(currentInput);
    const response = generateResponse(currentInput, category);

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response,
        timestamp: new Date(),
        category: category,
        query: currentInput
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Show quick actions for certain categories
      if (category === 'help' || category === 'navigation') {
        setShowQuickActions(true);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action) => {
    const actionMap = {
      'products': '/products',
      'categories': '/categories',
      'cart': '/checkout',
      'orders': '/orders'
    };

    if (actionMap[action]) {
      navigateTo(actionMap[action]);
    }
  };

  const handleToggleChat = () => {
    console.log('🎯 Chatbot clicked! Opening chat...');
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowQuickActions(false);
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 ${isOpen ? 'w-80 sm:w-80 md:w-96' : 'w-16'}`}>
      <button
        onClick={handleToggleChat}
        className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 pointer-events-auto cursor-pointer ${
          isOpen
            ? 'bg-gray-600 hover:bg-gray-700'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }`}
        type="button"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Shopping Assistant</h3>
                <p className="text-xs sm:text-sm opacity-90">Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 sm:h-80 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.action}
                    onClick={() => handleQuickAction(action.action)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about shopping..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
          1
        </div>
      )}
    </div>
  );
};

export default Chatbot;

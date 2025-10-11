import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatbotModel } from '../services/chatbot_model.js';

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
  const [chatbotModel, setChatbotModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize the trained AI model
  useEffect(() => {
    const initializeModel = async () => {
      try {
        console.log('🚀 Initializing trained chatbot model...');
        setIsModelLoading(true);

        // Initialize the trained model with actual store products
        const model = new ChatbotModel(products);
        setChatbotModel(model);

        console.log('✅ Trained model initialized successfully with store data');
        setIsModelLoading(false);
      } catch (error) {
        console.error('❌ Failed to initialize model:', error);
        setIsModelLoading(false);
      }
    };

    if (products.length > 0) {
      initializeModel();
    }
  }, [products]);

  // Update model when products change
  useEffect(() => {
    if (chatbotModel?.isModelLoaded && products.length > 0) {
      chatbotModel.updateStoreProducts(products);
    }
  }, [products, chatbotModel]);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatbotModel) return;

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

    try {
      // Use the trained model to generate response
      const aiResponse = await chatbotModel.predict(currentInput);

      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: aiResponse.response,
          timestamp: new Date(),
          intent: aiResponse.intent,
          confidence: aiResponse.confidence,
          products: aiResponse.products
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);

        // Show quick actions for certain intents
        if (['customer_service', 'navigation', 'help'].includes(aiResponse.intent)) {
          setShowQuickActions(true);
        }
      }, 1000 + Math.random() * 1000);

    } catch (error) {
      console.error('❌ AI prediction failed:', error);

      // Fallback response
      setTimeout(() => {
        const fallbackMessage = {
          id: messages.length + 2,
          type: 'bot',
          text: `I'm having trouble understanding "${currentInput}". Could you try asking differently? For example:\n• "Find me a laptop"\n• "I need help with my order"\n• "Show me deals"`,
          timestamp: new Date(),
          intent: 'fallback',
          confidence: 0
        };

        setMessages(prev => [...prev, fallbackMessage]);
        setIsTyping(false);
      }, 800);
    }
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
                <h3 className="font-semibold text-sm sm:text-base">AI Shopping Assistant</h3>
                <p className="text-xs sm:text-sm opacity-90">
                  {isModelLoading ? 'Loading...' : 'Online'}
                </p>
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

                  {/* Show AI confidence for debugging */}
                  {message.confidence !== undefined && message.confidence > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      🎯 Intent: {message.intent} (Confidence: {Math.round(message.confidence * 100)}%)
                    </p>
                  )}
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
                disabled={isModelLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isModelLoading}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>

            {/* Model Status */}
            <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
              <span>
                🧠 AI Model: {isModelLoading ? '⏳ Loading...' : '✅ Ready'}
                {chatbotModel && ` | Products: ${products.length}`}
              </span>
              {chatbotModel && (
                <button
                  onClick={() => console.log(chatbotModel.exportTrainingData())}
                  className="text-blue-500 hover:text-blue-700"
                  title="Export training data"
                >
                  📊
                </button>
              )}
            </div>
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

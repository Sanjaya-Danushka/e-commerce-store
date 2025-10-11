// Advanced AI Model Service for E-commerce Chatbot
// Uses training dataset for intelligent responses

// Intent Classification Engine
class IntentClassifier {
  constructor(intents) {
    this.intents = intents;
    this.patterns = this.buildPatternIndex(intents);
  }

  buildPatternIndex(intents) {
    const patterns = {};

    intents.forEach(intent => {
      patterns[intent.tag] = intent.patterns.map(pattern => ({
        pattern: pattern.toLowerCase(),
        weight: 1.0
      }));
    });

    return patterns;
  }

  classify(message) {
    const lowerMessage = message.toLowerCase();
    const scores = {};
    const debugMatches = {};

    // Calculate scores for each intent with improved weighting
    Object.keys(this.patterns).forEach(intent => {
      scores[intent] = 0;
      debugMatches[intent] = [];

      this.patterns[intent].forEach(({ pattern, weight }) => {
        // Exact phrase match gets higher score
        if (lowerMessage === pattern) {
          scores[intent] += weight * 3;
          debugMatches[intent].push(`EXACT: ${pattern}`);
        }
        // Contains pattern as whole word
        else if (lowerMessage.includes(` ${pattern} `) || lowerMessage.startsWith(`${pattern} `) || lowerMessage.endsWith(` ${pattern}`)) {
          scores[intent] += weight * 2;
          debugMatches[intent].push(`PHRASE: ${pattern}`);
        }
        // Contains pattern (basic match)
        else if (lowerMessage.includes(pattern)) {
          scores[intent] += weight;
          debugMatches[intent].push(`PARTIAL: ${pattern}`);
        }
      });
    });

    // Apply intent-specific bonuses
    if (lowerMessage.includes('go to') || lowerMessage.includes('take me') || lowerMessage.includes('visit') || lowerMessage.includes('open')) {
      scores.navigation = (scores.navigation || 0) + 2;
      debugMatches.navigation = (debugMatches.navigation || []).concat(['NAVIGATION_BONUS']);
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('customer care') || lowerMessage.includes('support')) {
      scores.customer_service = (scores.customer_service || 0) + 2;
      debugMatches.customer_service = (debugMatches.customer_service || []).concat(['SERVICE_BONUS']);
    }

    // Find the intent with highest score
    let bestIntent = 'general';
    let bestScore = 0;

    Object.keys(scores).forEach(intent => {
      if (scores[intent] > bestScore) {
        bestScore = scores[intent];
        bestIntent = intent;
      }
    });

    // Calculate confidence based on score relative to total possible patterns
    const totalPatterns = Object.values(this.patterns).reduce((sum, patterns) => sum + patterns.length, 0);
    const confidence = Math.min(bestScore / Math.max(totalPatterns * 0.5, 1), 1.0);

    console.log('🎯 Intent Classification Debug:', {
      message: lowerMessage,
      bestIntent,
      confidence: Math.round(confidence * 100) + '%',
      scores,
      debugMatches
    });

    return {
      intent: bestIntent,
      confidence: confidence,
      scores: scores
    };
  }

  updatePatterns(intents) {
    this.intents = intents;
    this.patterns = this.buildPatternIndex(intents);
  }
}

// Response Generation Engine
class ResponseGenerator {
  constructor(intents) {
    this.intents = intents;
  }

  generate(intentResult) {
    const intent = this.intents.find(i => i.tag === intentResult.intent);

    if (!intent || !intent.responses || intent.responses.length === 0) {
      return this.getDefaultResponse(intentResult.intent);
    }

    // Select a random response from available options
    const response = intent.responses[Math.floor(Math.random() * intent.responses.length)];

    return response;
  }

  getDefaultResponse(intent) {
    const defaultResponses = {
      greeting: "Hello! How can I help you today?",
      customer_service: "I'm here to help! What seems to be the problem?",
      product_search: "What kind of product are you looking for?",
      navigation: "Where would you like to go?",
      price_inquiry: "I can help you find products in your budget!",
      general: "I'm here to help with any questions you have!"
    };

    return defaultResponses[intent] || defaultResponses.general;
  }
}

// Product Matching Engine
class ProductMatcher {
  constructor(products) {
    this.products = products;
    this.productIndex = this.buildProductIndex(products);
  }

  buildProductIndex(products) {
    const index = {};

    products.forEach(product => {
      // Index by name words
      product.name.toLowerCase().split(/\s+/).forEach(word => {
        if (!index[word]) index[word] = [];
        index[word].push(product);
      });

      // Index by category
      if (product.category) {
        const categoryKey = product.category.toLowerCase();
        if (!index[categoryKey]) {
          index[categoryKey] = [];
        }
        index[categoryKey].push(product);
      }

      // Index by keywords
      if (product.keywords) {
        product.keywords.forEach(keyword => {
          if (!index[keyword]) index[keyword] = [];
          index[keyword].push(product);
        });
      }
    });

    return index;
  }

  findMatches(query) {
    const lowerQuery = query.toLowerCase();
    const matches = new Map();

    // Find products matching query terms
    lowerQuery.split(/\s+/).forEach(term => {
      if (this.productIndex[term]) {
        this.productIndex[term].forEach(product => {
          const currentScore = matches.get(product.id) || 0;
          matches.set(product.id, currentScore + 1);
        });
      }
    });

    // Convert to array and sort by score
    return Array.from(matches.entries())
      .map(([id, score]) => ({ ...this.products.find(p => p.id === id), matchScore: score }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }
}

class ChatbotModel {
  constructor() {
    this.isModelLoaded = false;
    this.trainingData = null;
    this.intentClassifier = null;
    this.responseGenerator = null;
    this.productMatcher = null;
    this.conversationHistory = [];

    this.loadTrainingData();
  }

  async loadTrainingData() {
    try {
      console.log('📚 Loading training dataset...');

      // In a real implementation, this would load from the backend
      // For now, we'll simulate loading the dataset
      const response = await fetch('/backend/datasets/training_data.json');
      if (!response.ok) {
        throw new Error('Failed to load training data');
      }

      this.trainingData = await response.json();
      console.log(`✅ Loaded training data: ${this.trainingData.intents.length} intents, ${this.trainingData.products.length} products`);

      this.initializeModel();
    } catch (error) {
      console.error('❌ Failed to load training data:', error);
      this.fallbackToBasicModel();
    }
  }

  initializeModel() {
    // Initialize the intent classification model
    this.intentClassifier = new IntentClassifier(this.trainingData.intents);

    // Initialize the response generator
    this.responseGenerator = new ResponseGenerator(this.trainingData.intents);

    // Initialize the product matcher
    this.productMatcher = new ProductMatcher(this.trainingData.products);

    this.isModelLoaded = true;
    console.log('🧠 Advanced AI Model initialized successfully');
  }

  fallbackToBasicModel() {
    console.log('🔄 Falling back to basic rule-based model');
    this.isModelLoaded = true;
  }

  async predict(message) {
    if (!this.isModelLoaded) {
      await this.loadTrainingData();
    }

    try {
      // Step 1: Classify intent
      const intentResult = this.intentClassifier.classify(message);

      // Step 2: Generate response based on intent
      const response = this.responseGenerator.generate(intentResult);

      // Step 3: Find relevant products if needed
      let products = [];
      if (intentResult.intent === 'product_search') {
        products = this.productMatcher.findMatches(message);
      }

      // Step 4: Enhance response with product information
      const enhancedResponse = this.enhanceResponse(response, products, message);

      // Step 5: Save to conversation history
      this.conversationHistory.push({
        userMessage: message,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        response: enhancedResponse,
        timestamp: new Date().toISOString()
      });

      return {
        response: enhancedResponse,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        products: products,
        suggestions: this.generateSuggestions(intentResult.intent, products)
      };

    } catch (error) {
      console.error('❌ Prediction failed:', error);
      return {
        response: "I'm having trouble understanding. Could you try rephrasing your question?",
        intent: 'unknown',
        confidence: 0
      };
    }
  }

  enhanceResponse(baseResponse, products, query) {
    if (products.length > 0 && baseResponse.includes('recommendations')) {
      const productList = products.slice(0, 3).map((product, index) => {
        const matchLevel = product.name.toLowerCase().includes(query.toLowerCase()) ? '🎯' : '✨';
        return `${index + 1}. **${product.name}** ${matchLevel}\n   💰 ${this.formatMoney(product.priceCents)}\n   📂 ${product.category}\n   ⭐ ${product.rating?.stars || 'N/A'} stars (${product.rating?.count || 0} reviews)`;
      }).join('\n\n');

      return `${baseResponse}\n\n${productList}\n\nWhich one interests you most? I can provide more details or help you add it to your cart! 🛒`;
    }

    return baseResponse;
  }

  generateSuggestions(intent, products) {
    const suggestions = [];

    if (intent === 'product_search' && products.length > 0) {
      suggestions.push('Ask for more details about any product');
      suggestions.push('Compare prices between products');
      suggestions.push('Add items to your cart');
    }

    if (intent === 'customer_service') {
      suggestions.push('Contact our support team');
      suggestions.push('Request a refund or exchange');
      suggestions.push('Track your order status');
    }

    if (intent === 'navigation') {
      suggestions.push('Browse our product categories');
      suggestions.push('Check your cart');
      suggestions.push('View your order history');
    }

    return suggestions;
  }

  formatMoney(cents) {
    // Check if Intl is available (browser environment)
    // eslint-disable-next-line no-undef
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      // eslint-disable-next-line no-undef
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(cents / 100);
    } else {
      // Fallback for Node.js environment or when Intl is not available
      return `$${ (cents / 100).toFixed(2) }`;
    }
  }

  // Training method for continuous learning
  async trainModel(newConversations = []) {
    if (!this.trainingData) return;

    console.log('🧠 Training model with new conversation data...');

    // Add new conversations to training data
    newConversations.forEach(conv => {
      if (conv.confidence > 0.7) {
        // Add successful patterns to training data
        const intent = this.trainingData.intents.find(i => i.tag === conv.intent);
        if (intent && !intent.patterns.includes(conv.userMessage.toLowerCase())) {
          intent.patterns.push(conv.userMessage.toLowerCase());
        }
      }
    });

    // Update the model with new patterns
    this.intentClassifier.updatePatterns(this.trainingData.intents);

    console.log('✅ Model training completed');
  }

  // Export training data for backup
  exportTrainingData() {
    return {
      intents: this.trainingData.intents,
      products: this.trainingData.products,
      conversationHistory: this.conversationHistory,
      exportedAt: new Date().toISOString()
    };
  }
}

// Export the model
export { ChatbotModel };

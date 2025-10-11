// Advanced AI Model Service for E-commerce Chatbot
// Uses training dataset for intelligent responses

// Check if we're in a browser environment
const _isBrowser = typeof window !== 'undefined';

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
  constructor(products = []) {
    this.products = products;
    this.productIndex = this.buildProductIndex(products);
  }

  buildProductIndex(products) {
    const index = {};

    if (!products || products.length === 0) {
      return index;
    }

    products.forEach(product => {
      // Index by name words
      if (product.name) {
        product.name.toLowerCase().split(/\s+/).forEach(word => {
          if (!index[word]) index[word] = [];
          index[word].push(product);
        });
      }

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

      // Index by description words
      if (product.description) {
        product.description.toLowerCase().split(/\s+/).slice(0, 10).forEach(word => {
          if (!index[word]) index[word] = [];
          index[word].push(product);
        });
      }
    });

    return index;
  }

  findMatches(query) {
    if (!this.products || this.products.length === 0) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const matches = new Map();

    // Enhanced matching algorithm
    this.products.forEach(product => {
      let score = 0;

      // Exact name match gets highest score
      if (product.name.toLowerCase() === lowerQuery) {
        score += 100;
      }
      // Name contains query
      else if (product.name.toLowerCase().includes(lowerQuery)) {
        score += 50;
      }
      // Query contains product name
      else if (lowerQuery.includes(product.name.toLowerCase())) {
        score += 30;
      }

      // Category matching
      if (product.category && product.category.toLowerCase().includes(lowerQuery)) {
        score += 20;
      }

      // Keywords matching
      if (product.keywords) {
        product.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(lowerQuery) || lowerQuery.includes(keyword.toLowerCase())) {
            score += 15;
          }
        });
      }

      // Description matching
      if (product.description && product.description.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }

      // Boost popular products
      if (product.rating && product.rating.stars >= 4.5) score += 5;
      if (product.rating && product.rating.count > 100) score += 3;

      if (score > 0) {
        matches.set(product.id, score);
      }
    });

    // Convert to array and sort by score
    return Array.from(matches.entries())
      .map(([id, score]) => ({ ...this.products.find(p => p.id === id), matchScore: score }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }

  // Method to update products when new data is available
  updateProducts(newProducts) {
    if (newProducts && newProducts.length > 0) {
      this.products = newProducts;
      this.productIndex = this.buildProductIndex(newProducts);
      console.log(`📦 Updated product matcher with ${newProducts.length} products`);
    }
  }
}

class ChatbotModel {
  constructor(products = []) {
    this.isModelLoaded = false;
    this.trainingData = null;
    this.intentClassifier = null;
    this.responseGenerator = null;
    this.productMatcher = null;
    this.conversationHistory = [];
    this.storeProducts = products; // Store the actual products from the e-commerce site

    this.loadTrainingData();
  }

  async loadTrainingData() {
    try {
      console.log('📚 Loading training dataset...');

      // Load external training data
      const response = await fetch('/training_data.json');
      if (!response.ok) {
        throw new Error(`Failed to load training data: ${response.status}`);
      }

      const externalTrainingData = await response.json();
      console.log(`✅ Loaded external training data: ${externalTrainingData.intents.length} intents, ${externalTrainingData.products.length} products`);

      // Combine external data with store-specific data
      this.trainingData = this.combineTrainingData(externalTrainingData, this.storeProducts);

      console.log(`✅ Combined training data: ${this.trainingData.intents.length} intents, ${this.trainingData.products.length} products`);

      this.initializeModel();
    } catch (error) {
      console.error('❌ Failed to load training data:', error);
      this.fallbackToBasicModel();
    }
  }

  combineTrainingData(externalData, storeProducts) {
    // Start with external training data
    const combinedData = { ...externalData };

    // Add store-specific products to the training data
    if (storeProducts && storeProducts.length > 0) {
      // Merge products, avoiding duplicates by ID
      const existingProductIds = new Set(combinedData.products.map(p => p.id));
      const newProducts = storeProducts.filter(p => !existingProductIds.has(p.id));

      combinedData.products = [...combinedData.products, ...newProducts];

      // Update metadata
      combinedData.training_metadata.total_products = combinedData.products.length;
      combinedData.training_metadata.store_products_added = newProducts.length;
      combinedData.training_metadata.last_updated = new Date().toISOString();

      console.log(`🛍️ Added ${newProducts.length} store products to training data`);
    }

    // Add store-specific intents and patterns
    this.addStoreSpecificIntents(combinedData);

    return combinedData;
  }

  addStoreSpecificIntents(trainingData) {
    // Add store-specific greeting responses
    const greetingIntent = trainingData.intents.find(i => i.tag === 'greeting');
    if (greetingIntent) {
      greetingIntent.responses.push(
        "Welcome to our store! I'm here to help you discover amazing products from our catalog! 🛍️",
        "Hi! I'm your shopping assistant, trained on our actual product inventory. What would you like to find today?",
        "Hello! I'm excited to help you shop from our extensive collection. What are you looking for?"
      );
    }

    // Add store-specific product search patterns and responses
    const productSearchIntent = trainingData.intents.find(i => i.tag === 'product_search');
    if (productSearchIntent) {
      productSearchIntent.patterns.push(
        'from your store',
        'in your inventory',
        'do you sell',
        'available in store',
        'your products',
        'what products do you have',
        'show me your',
        'browse your'
      );

      productSearchIntent.responses.push(
        "I found some great products from our store! Here are my top recommendations:",
        "Based on our current inventory, here are the best matches for you:",
        "I've found these excellent products from our catalog:"
      );
    }

    // Add store-specific navigation patterns and responses
    const navigationIntent = trainingData.intents.find(i => i.tag === 'navigation');
    if (navigationIntent) {
      navigationIntent.patterns.push(
        'go to products',
        'show me products',
        'browse store',
        'shop now',
        'see products'
      );

      navigationIntent.responses.push(
        "I can help you navigate our store! We have products, categories, cart, and orders sections.",
        "Let me guide you through our site! You can browse products, check categories, view your cart, or track orders.",
        "Our store has several sections - let me help you find what you need!"
      );
    }

    // Add category-specific responses
    const categoryIntent = trainingData.intents.find(i => i.tag === 'category_browse');
    if (categoryIntent) {
      categoryIntent.responses.push(
        "We have products organized by category. Let me show you what's available!",
        "Our categories make it easy to find what you need. What type of products interest you?"
      );
    }
  }

  initializeModel() {
    // Initialize the intent classification model
    this.intentClassifier = new IntentClassifier(this.trainingData.intents);

    // Initialize the response generator
    this.responseGenerator = new ResponseGenerator(this.trainingData.intents);

    // Initialize the product matcher with available products
    const productsToUse = this.storeProducts.length > 0 ? this.storeProducts : this.trainingData.products;
    this.productMatcher = new ProductMatcher(productsToUse);

    this.isModelLoaded = true;
    console.log('🧠 Advanced AI Model initialized successfully');
    console.log(`📦 Using ${this.productMatcher.products.length} products for matching`);
  }

  // Method to update products when new data is available
  updateStoreProducts(newProducts) {
    if (!this.productMatcher) {
      console.warn('⚠️ Product matcher not initialized yet, skipping update');
      return;
    }

    if (newProducts && newProducts.length > 0) {
      this.storeProducts = newProducts;
      // Update the product matcher with new products
      this.productMatcher.updateProducts(newProducts);
      console.log(`🛍️ Updated chatbot model with ${newProducts.length} store products`);
    }
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
    // Check if we're in a browser environment with Intl support
    if (_isBrowser && typeof Intl !== 'undefined' && Intl.NumberFormat) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(cents / 100);
    } else {
      // Fallback for environments without Intl
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

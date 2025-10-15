import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { formatMoney } from "../utils/money";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51SISPUCSFn0z5K5oSB28IzVbGjk5MEIzXO6gcy4kDl8rf3bAX7o4lvItVckWdJNjzsjAELwrEyELe6X17gXAxDkl00sXFNAAPQ');

// Stripe Payment Form Component
const PaymentForm = forwardRef((props, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useImperativeHandle(ref, () => ({
    processPayment: async (amount) => {
      if (!stripe || !elements) {
        throw { success: false, error: 'Stripe not initialized' };
      }

      setIsProcessing(true);
      setCardError("");

      try {
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          throw { success: false, error: 'Card element not found' };
        }

        // Create payment method using Stripe Elements
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // You can get this from a form field if needed
          },
        });

        if (error) {
          throw { success: false, error: error.message };
        }

        // Create payment intent on your backend
        const response = await axios.post('/api/stripe/create-payment-intent', {
          amount: amount, // Amount in cents
          currency: 'usd',
          paymentMethodId: paymentMethod.id,
          metadata: {
            paymentMethod: 'stripe',
            customerEmail: 'customer@example.com' // Get from user context
          }
        });

        if (response.data.requiresAction) {
          // Handle 3D Secure authentication
          const { error: confirmError } = await stripe.confirmCardPayment(
            response.data.clientSecret,
            {
              payment_method: paymentMethod.id,
            }
          );

          if (confirmError) {
            throw { success: false, error: confirmError.message };
          }
        }

        return {
          success: true,
          transactionId: response.data.paymentIntentId,
          message: "Payment processed successfully via Stripe"
        };

      } catch (error) {
        console.error('Stripe payment error:', error);
        throw {
          success: false,
          error: error.error || error.message || "Payment processing failed"
        };
      } finally {
        setIsProcessing(false);
      }
    }
  }));

  return (
    <div>
      <form>
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900">Credit Card Information</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Details
            </label>
            <div className={`p-3 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
              cardError ? 'border-red-500' : 'border-gray-300'
            }`}>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
            {cardError && (
              <p className="mt-1 text-sm text-red-600">{cardError}</p>
            )}
          </div>
        </div>
      </form>
      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm font-medium">Processing payment...</p>
        </div>
      )}
    </div>
  );
});

const CheckoutPage = () => {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit_card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const paymentFormRef = useRef(null);

  useEffect(() => {
    // Fetch cart items directly
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/api/cart-items?expand=product");
        setCartItems(response.data);
        // Initialize all items as selected
        const initialSelectedItems = {};
        response.data.forEach(item => {
          initialSelectedItems[item.productId] = true;
        });
        setSelectedItems(initialSelectedItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchCartItems();

    // Fetch delivery options
    const fetchDeliveryOptions = async () => {
      try {
        const response = await axios.get("/api/delivery-options");
        setDeliveryOptions(response.data);
      } catch (error) {
        console.error("Error fetching delivery options:", error);
      }
    };
    fetchDeliveryOptions();
  }, []);

  const calculateDeliveryDate = (deliveryDays) => {
    const today = dayjs();
    return today.add(deliveryDays, "days");
  };

  const handleUpdateQuantity = (productId) => {
    const newQuantity = prompt("Enter new quantity:");
    if (newQuantity && !isNaN(newQuantity) && newQuantity > 0) {
      axios
        .put(`/api/cart-items/${productId}`, {
          quantity: parseInt(newQuantity),
        })
        .then(() => {
          setCartItems(
            cartItems.map((item) =>
              item.productId === productId
                ? { ...item, quantity: parseInt(newQuantity) }
                : item
            )
          );
        })
        .catch((error) => {
          console.error("Error updating quantity:", error);
        });
    }
  };

  const handleDeleteItem = (productId) => {
    if (confirm("Are you sure you want to delete this item?")) {
      axios
        .delete(`/api/cart-items/${productId}`)
        .then(() => {
          setCartItems(
            cartItems.filter((item) => item.productId !== productId)
          );
          setSelectedItems(prev => {
            const newSelectedItems = { ...prev };
            delete newSelectedItems[productId];
            return newSelectedItems;
          });
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
        });
    }
  };

  const handleDeliveryOptionChange = (productId, deliveryOptionId) => {
    axios
      .put(`/api/cart-items/${productId}`, {
        deliveryOptionId: deliveryOptionId,
      })
      .then(() => {
        setCartItems(
          cartItems.map((item) =>
            item.productId === productId ? { ...item, deliveryOptionId } : item
          )
        );
      })
      .catch((error) => {
        console.error("Error updating delivery option:", error);
      });
  };

  const handleItemSelectionChange = (productId, isSelected) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: isSelected
    }));
  };

  const processApplePay = async () => {
    // Check if Apple Pay is available
    if (typeof window !== 'undefined' && (!window.ApplePaySession || !window.ApplePaySession.canMakePayments)) {
      throw {
        success: false,
        error: "Apple Pay is not available on this device."
      };
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.02) { // 98% success rate
          resolve({
            success: true,
            transactionId: `apple_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message: "Apple Pay payment successful"
          });
        } else {
          reject({
            success: false,
            error: "Apple Pay payment failed. Please try a different method."
          });
        }
      }, 2000);
    });
  };

  const processGooglePay = async () => {
    // Check if Google Pay is available
    if (typeof window !== 'undefined' && !window.PaymentRequest) {
      throw {
        success: false,
        error: "Google Pay is not supported in this browser."
      };
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.04) { // 96% success rate
          resolve({
            success: true,
            transactionId: `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message: "Google Pay payment processed"
          });
        } else {
          reject({
            success: false,
            error: "Google Pay payment was declined."
          });
        }
      }, 2500);
    });
  };

  const processPayPalPayment = async () => {
    try {
      const amount = calculateOrderTotal();
      const description = `ShopEase Order - ${calculateItemsCount()} items`;

      // Create PayPal payment on backend
      const response = await axios.post('/api/stripe/create-paypal-payment', {
        amount: amount.toString(),
        currency: 'USD',
        description: description,
        returnUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`
      });

      if (response.data.success && response.data.approvalUrl) {
        // Redirect to PayPal for payment
        window.location.href = response.data.approvalUrl;
      } else {
        throw new Error(response.data.error || 'Failed to create PayPal payment');
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      throw {
        success: false,
        error: error.response?.data?.error || error.message || "PayPal payment failed"
      };
    }
  };

  const handlePlaceOrder = async () => {
    const selectedCartItems = cartItems.filter(item => selectedItems[item.productId]);

    if (selectedCartItems.length === 0) {
      alert("Please select at least one item to place your order.");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError("");

    try {
      // First process the payment
      let paymentResult;

      switch (selectedPaymentMethod) {
        case "credit_card":
          if (paymentFormRef.current) {
            paymentResult = await paymentFormRef.current.processPayment(calculateOrderTotal());
          } else {
            throw new Error("Payment form not available");
          }
          break;
        case "paypal":
          paymentResult = await processPayPalPayment();
          break;
        case "apple_pay":
          paymentResult = await processApplePay();
          break;
        case "google_pay":
          paymentResult = await processGooglePay();
          break;
        default:
          throw new Error("Invalid payment method selected");
      }

      if (paymentResult.success) {
        // Payment successful, now create the order
        const itemsToOrder = selectedCartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          deliveryOptionId: item.deliveryOptionId
        }));

        const orderResponse = await axios.post("/api/orders", {
          cartItems: itemsToOrder,
          paymentMethod: selectedPaymentMethod,
          paymentTransactionId: paymentResult.transactionId,
          paymentStatus: "completed"
        });

        // Re-fetch cart items to get updated cart state
        const fetchCartItems = async () => {
          try {
            const response = await axios.get("/api/cart-items?expand=product");
            setCartItems(response.data);
            // Re-initialize selected items for remaining items
            const initialSelectedItems = {};
            response.data.forEach(item => {
              initialSelectedItems[item.productId] = true;
            });
            setSelectedItems(initialSelectedItems);
          } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartItems([]);
            setSelectedItems({});
          }
        };

        await fetchCartItems();

        // Redirect to order success page with order ID
        window.location.href = `/order-success?orderId=${orderResponse.data.orderId}`;
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setPaymentError(error.error || "Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const calculateItemsCount = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => {
      return selectedItems[item.productId] ? total + item.quantity : total;
    }, 0);
  };

  const calculateItemsTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce(
      (total, item) => {
        return selectedItems[item.productId]
          ? total + item.product.priceCents * item.quantity
          : total;
      },
      0
    );
  };

  const calculateShippingTotal = () => {
    if (
      !cartItems ||
      cartItems.length === 0 ||
      !deliveryOptions ||
      deliveryOptions.length === 0
    )
      return 0;
    return cartItems.reduce((total, item) => {
      if (!selectedItems[item.productId]) return total;
      const deliveryOption = deliveryOptions.find(
        (opt) => opt.id === item.deliveryOptionId
      );
      return total + (deliveryOption ? deliveryOption.priceCents : 0);
    }, 0);
  };

  const calculateTotalBeforeTax = () => {
    return calculateItemsTotal() + calculateShippingTotal();
  };

  const calculateTax = () => {
    return Math.round(calculateTotalBeforeTax() * 0.1);
  };

  const calculateOrderTotal = () => {
    return calculateTotalBeforeTax() + calculateTax();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Checkout</title>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-gray-900 tracking-tight">ShopEase</span>
                </div>
              </a>
            </div>

            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">
                Checkout ({calculateItemsCount()} items)
              </h1>
            </div>

            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review your order</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            {deliveryOptions.length > 0 &&
              cartItems.length > 0 &&
              cartItems.map((cartItem) => {
                const selectedDeliveryOption = deliveryOptions.find(
                  (deliveryOption) => {
                    return deliveryOption.id === cartItem.deliveryOptionId;
                  }
                );
                return (
                  <div key={cartItem.productId} className={`bg-white rounded-xl shadow-sm p-6 ${!selectedItems[cartItem.productId] ? 'opacity-60' : ''}`}>
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-900">
                          Delivery date:{" "}
                          <span className="font-semibold">
                            {selectedDeliveryOption &&
                              calculateDeliveryDate(
                                selectedDeliveryOption.deliveryDays
                              ).format("dddd, MMMM D")}
                          </span>
                        </p>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedItems[cartItem.productId] || false}
                            onChange={(e) => handleItemSelectionChange(cartItem.productId, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm font-medium text-blue-900">Buy this item</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          className="w-20 h-20 object-cover rounded-lg"
                          src={`/${cartItem.product.image}`}
                          alt={cartItem.product.name}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {cartItem.product.name}
                        </h3>
                        <p className="text-lg font-bold text-gray-900 mb-3">
                          {formatMoney(cartItem.product.priceCents)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                              Quantity:{" "}
                              <span className="font-medium text-gray-900">
                                {cartItem.quantity}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              onClick={() => handleUpdateQuantity(cartItem.productId)}>
                              Update
                            </button>
                            <button
                              className="text-sm text-red-600 hover:text-red-800 font-medium"
                              onClick={() => handleDeleteItem(cartItem.productId)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-6 pt-6 border-t border-gray-200 ${!selectedItems[cartItem.productId] ? 'opacity-40 pointer-events-none' : ''}`}>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Choose a delivery option:
                      </h4>
                      <div className="space-y-3">
                        {deliveryOptions.map((deliveryOption) => {
                          let priceString = "FREE Shipping";
                          if (deliveryOption.priceCents > 0) {
                            priceString = `${formatMoney(
                              deliveryOption.priceCents
                            )} - Shipping`;
                          }

                          return (
                            <label
                              key={deliveryOption.id}
                              className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="radio"
                                checked={
                                  deliveryOption.id ===
                                  cartItem.deliveryOptionId
                                }
                                onChange={() =>
                                  handleDeliveryOptionChange(
                                    cartItem.productId,
                                    deliveryOption.id
                                  )
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                name={`delivery-option-${cartItem.productId}`}
                              />
                              <div className="ml-3 flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {calculateDeliveryDate(
                                    deliveryOption.deliveryDays
                                  ).format("dddd, MMMM D")}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {priceString}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Payment Summary */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Payment Method
              </h3>

              <div className="space-y-3 mb-6">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedPaymentMethod === "credit_card"
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    value="credit_card"
                    checked={selectedPaymentMethod === "credit_card"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                      <span className="font-medium text-gray-900">Credit Card</span>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedPaymentMethod === "paypal"
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    value="paypal"
                    checked={selectedPaymentMethod === "paypal"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2C5.59 2 2 5.59 2 10s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-1.07 11.93c-.36.36-.93.36-1.29 0l-1.5-1.5c-.36-.36-.36-.93 0-1.29s.93-.36 1.29 0l1.5 1.5c.36.36.36.93 0 1.29zm0-3c-.36.36-.93.36-1.29 0l-1.5-1.5c-.36-.36-.36-.93 0-1.29s.93-.36 1.29 0l1.5 1.5c.36.36.36.93 0 1.29zm3 3c-.36.36-.93.36-1.29 0l-1.5-1.5c-.36-.36-.36-.93 0-1.29s.93-.36 1.29 0l1.5 1.5c.36.36.36.93 0 1.29zm0-3c-.36.36-.93.36-1.29 0l-1.5-1.5c-.36-.36-.36-.93 0-1.29s.93-.36 1.29 0l1.5 1.5c.36.36.36.93 0 1.29z"/>
                      </svg>
                      <span className="font-medium text-gray-900">shopease</span>
                      <span className="text-sm text-gray-500 ml-2">(via PayPal)</span>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedPaymentMethod === "apple_pay"
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    value="apple_pay"
                    checked={selectedPaymentMethod === "apple_pay"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-900 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2C5.59 2 2 5.59 2 10s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                      </svg>
                      <span className="font-medium text-gray-900">Apple Pay</span>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedPaymentMethod === "google_pay"
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    value="google_pay"
                    checked={selectedPaymentMethod === "google_pay"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2C5.59 2 2 5.59 2 10s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                      </svg>
                      <span className="font-medium text-gray-900">Google Pay</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Payment Form Section */}
              {selectedPaymentMethod === "credit_card" && (
                <Elements stripe={stripePromise}>
                  <PaymentForm ref={paymentFormRef} />
                </Elements>
              )}

              {selectedPaymentMethod === "apple_pay" && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <button
                      className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => {/* Apple Pay integration would go here */}}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2C5.59 2 2 5.59 2 10s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                      </svg>
                      Pay with Apple Pay
                    </button>
                    <p className="mt-2 text-sm text-gray-600">
                      Touch ID, Face ID, or passcode required
                    </p>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === "google_pay" && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <button
                      className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => {/* Google Pay integration would go here */}}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2C5.59 2 2 5.59 2 10s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                      </svg>
                      Pay with Google Pay
                    </button>
                    <p className="mt-2 text-sm text-gray-600">
                      Fast, simple checkout with your saved cards
                    </p>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === "paypal" && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <button
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      onClick={processPayPalPayment}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2C5.59 2 2 5.59 2 10s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm-1.07 11.93c-.36.36-.93.36-1.29 0l-1.5-1.5c-.36-.36-.36-.93 0-1.29s.93-.36 1.29 0l1.5 1.5c.36.36.36.93 0 1.29zm0-3c-.36.36-.93.36-1.29 0l-1.5-1.5c-.36-.36-.36-.93 0-1.29s.93-.36 1.29 0l1.5 1.5c.36.36.36.93 0 1.29zm3 3c-.36.36-.93.36-1.29 0l-1.5-1.5c-.36-.36-.36-.93 0-1.29s.93-.36 1.29 0l1.5 1.5c.36.36.36.93 0 1.29zm0-3c-.36.36-.93.36-1.29 0l-1.5-1.5c-.36-.36-.36-.93 0-1.29s.93-.36 1.29 0l1.5 1.5c.36.36.36.93 0 1.29z"/>
                      </svg>
                      Pay with shopease (PayPal)
                    </button>
                    <p className="mt-2 text-sm text-gray-600">
                      You'll be redirected to PayPal to complete your payment
                    </p>
                  </div>
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Payment Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items ({calculateItemsCount()}):</span>
                  <span className="font-medium">{formatMoney(calculateItemsTotal())}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping & handling:</span>
                  <span className="font-medium">{formatMoney(calculateShippingTotal())}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-gray-600">Total before tax:</span>
                  <span className="font-medium">{formatMoney(calculateTotalBeforeTax())}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated tax (10%):</span>
                  <span className="font-medium">{formatMoney(calculateTax())}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Order total:</span>
                  <span className="text-lg font-bold text-gray-900">{formatMoney(calculateOrderTotal())}</span>
                </div>
              </div>

              <button
                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  cartItems.length === 0 || Object.values(selectedItems).every(selected => !selected) || isProcessingPayment
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || Object.values(selectedItems).every(selected => !selected) || isProcessingPayment}>
                {isProcessingPayment ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  'Place your order'
                )}
              </button>

              {paymentError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-medium">{paymentError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

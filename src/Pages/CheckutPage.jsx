import React from "react";
import { formatMoney } from "../utils/money";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const CheckutPage = () => {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

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

  const handlePlaceOrder = () => {
    const selectedCartItems = cartItems.filter(item => selectedItems[item.productId]);

    if (selectedCartItems.length === 0) {
      alert("Please select at least one item to place your order.");
      return;
    }

    // Send only the necessary data to backend
    const itemsToOrder = selectedCartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId
    }));

    axios
      .post("/api/orders", { cartItems: itemsToOrder })
      .then(() => {
        alert("Order placed successfully!");
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
        fetchCartItems();
        window.location.href = "/orders";
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      });
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
                  cartItems.length === 0 || Object.values(selectedItems).every(selected => !selected)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || Object.values(selectedItems).every(selected => !selected)}>
                Place your order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckutPage;

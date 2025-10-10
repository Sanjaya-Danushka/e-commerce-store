import React from "react";
import "./checkout.css";
import "./checkout-header.css";
import { formatMoney } from "../utils/money";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const CheckutPage = () => {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items directly
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/api/cart-items?expand=product");
        setCartItems(response.data);
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

  const handlePlaceOrder = () => {
    axios
      .post("/api/orders", {})
      .then(() => {
        alert("Order placed successfully!");
        setCartItems([]);
        window.location.href = "/orders";
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      });
  };

  const calculateItemsCount = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateItemsTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce(
      (total, item) => total + item.product.priceCents * item.quantity,
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
    <div>
      {" "}
      <title>Checkout</title>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="/images/logo-white.png" />
              <img className="mobile-logo" src="/images/mobile-logo.png" />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="/">
              {calculateItemsCount()} items
            </a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="/images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>
      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {deliveryOptions.length > 0 &&
              cartItems.length > 0 &&
              cartItems.map((cartItem) => {
                const selectedDeliveryOption = deliveryOptions.find(
                  (deliveryOption) => {
                    return deliveryOption.id === cartItem.deliveryOptionId;
                  }
                );
                return (
                  <div key={cartItem.productId} className="cart-item-container">
                    <div className="delivery-date">
                      Delivery date:{" "}
                      {selectedDeliveryOption &&
                        calculateDeliveryDate(
                          selectedDeliveryOption.deliveryDays
                        ).format("dddd, MMMM D")}
                    </div>

                    <div className="cart-item-details-grid">
                      <img
                        className="product-image"
                        src={`/${cartItem.product.image}`}
                      />

                      <div className="cart-item-details">
                        <div className="product-name">
                          {cartItem.product.name}
                        </div>
                        <div className="product-price">
                          {formatMoney(cartItem.product.priceCents)}
                        </div>
                        <div className="product-quantity">
                          <span>
                            Quantity:{" "}
                            <span className="quantity-label">
                              {cartItem.quantity}
                            </span>
                          </span>
                          <span
                            className="update-quantity-link link-primary"
                            onClick={() =>
                              handleUpdateQuantity(cartItem.productId)
                            }
                            style={{ cursor: "pointer" }}>
                            Update
                          </span>
                          <span
                            className="delete-quantity-link link-primary"
                            onClick={() => handleDeleteItem(cartItem.productId)}
                            style={{ cursor: "pointer" }}>
                            Delete
                          </span>
                        </div>
                      </div>

                      <div className="delivery-options">
                        <div className="delivery-options-title">
                          Choose a delivery option:
                        </div>
                        {deliveryOptions.map((deliveryOption) => {
                          let priceString = "FREE Shipping";
                          if (deliveryOption.priceCents > 0) {
                            priceString = `${formatMoney(
                              deliveryOption.priceCents
                            )} - Shipping`;
                          }

                          return (
                            <div
                              key={deliveryOption.id}
                              className="delivery-option">
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
                                className="delivery-option-input"
                                name={`delivery-option-${cartItem.productId}`}
                              />
                              <div>
                                <div className="delivery-option-date">
                                  {calculateDeliveryDate(
                                    deliveryOption.deliveryDays
                                  ).format("dddd, MMMM D")}
                                </div>
                                <div className="delivery-option-price">
                                  {priceString}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">Payment Summary</div>
            <div className="payment-summary-row">
              <div>Items ({calculateItemsCount()}):</div>
              <div className="payment-summary-money">
                {formatMoney(calculateItemsTotal())}
              </div>
            </div>

            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">
                {formatMoney(calculateShippingTotal())}
              </div>
            </div>

            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">
                {formatMoney(calculateTotalBeforeTax())}
              </div>
            </div>

            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div className="payment-summary-money">
                {formatMoney(calculateTax())}
              </div>
            </div>

            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">
                {formatMoney(calculateOrderTotal())}
              </div>
            </div>

            <button
              className="place-order-button button-primary"
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}>
              Place your order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckutPage;

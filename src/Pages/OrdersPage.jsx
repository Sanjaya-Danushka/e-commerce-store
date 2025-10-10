import React from "react";
import "./orders.css";
import axios from "axios";
import { useEffect } from "react";
import Header from "../components/Header";
import { useState } from "react";
import dayjs from "dayjs";
import { formatMoney } from "../utils/money";

const OrdersPage = ({ cart }) => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/orders?expand=products")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleAddToCart = (productId) => {
    axios
      .post("http://localhost:3000/api/cart-items", {
        productId: productId,
        quantity: 1,
      })
      .then(() => {
        alert("Product added to cart!");
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("Failed to add product to cart.");
      });
  };

  return (
    <div>
      {" "}
      <title>Orders</title>
      <Header cart={cart} />
      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {orders.map((order) => {
            return (
              <div key={order.id} className="order-container">
                <div className="order-header">
                  <div className="order-header-left-section">
                    <div className="order-date">
                      <div className="order-header-label">Order Placed:</div>
                      <div>{dayjs(order.orderTimeMs).format("MMMM D")}</div>
                    </div>
                    <div className="order-total">
                      <div className="order-header-label">Total:</div>
                      <div>{formatMoney(order.totalCostCents)}</div>
                    </div>
                  </div>

                  <div className="order-header-right-section">
                    <div className="order-header-label">Order ID:</div>
                    <div>{order.id}</div>
                  </div>
                </div>

                <div className="order-details-grid">
                  {order.products && order.products.map((item) => (
                    <React.Fragment key={item.productId}>
                      <div className="product-image-container">
                        <img src={`/${item.product.image}`} alt={item.product.name} />
                      </div>

                      <div className="product-details">
                        <div className="product-name">
                          {item.product.name}
                        </div>
                        <div className="product-delivery-date">
                          Arriving on: {dayjs(item.estimatedDeliveryTimeMs).format("MMMM D")}
                        </div>
                        <div className="product-quantity">Quantity: {item.quantity}</div>
                        <button 
                          className="buy-again-button button-primary"
                          onClick={() => handleAddToCart(item.productId)}
                        >
                          <img
                            className="buy-again-icon"
                            src="/images/icons/buy-again.png"
                            alt="Buy again"
                          />
                          <span className="buy-again-message">Add to Cart</span>
                        </button>
                      </div>

                      <div className="product-actions">
                        <a href="/tracking">
                          <button className="track-package-button button-secondary">
                            Track package
                          </button>
                        </a>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

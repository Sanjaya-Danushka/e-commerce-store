import React, { useEffect, useState } from "react";
import "./orders.css";
import axios from "axios";
import Header from "../components/Header";
import OrderContainer from "../components/OrderContainer";

const OrdersPage = ({ cart, refreshCart }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("/api/orders?expand=products")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleAddToCart = (productId) => {
    axios
      .post("/api/cart-items", {
        productId: productId,
        quantity: 1,
      })
      .then(() => {
        refreshCart();
        alert("Product added to cart!");
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("Failed to add product to cart.");
      });
  };

  return (
    <div>
      <title>Orders</title>
      <Header cart={cart} />
      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {orders.map((order) => (
            <OrderContainer
              key={order.id}
              order={order}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

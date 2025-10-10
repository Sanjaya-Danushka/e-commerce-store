import React, { useEffect, useState } from "react";
import "./tracking.css";
import Header from "../components/Header";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const TrackingPage = ({ cart }) => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");

  const [order, setOrder] = useState(null);
  const [productItem, setProductItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}?expand=products`);
        setOrder(response.data);
        
        // Find the specific product in the order
        const product = response.data.products.find(
          (p) => p.productId === productId
        );
        setProductItem(product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setLoading(false);
      }
    };

    if (orderId && productId) {
      fetchOrderData();
    }
  }, [orderId, productId]);

  const getTrackingStatus = () => {
    if (!productItem) return { status: "preparing", progress: 0 };

    const currentTime = Date.now();
    const orderTime = order.orderTimeMs;
    const deliveryTime = productItem.estimatedDeliveryTimeMs;
    const totalTime = deliveryTime - orderTime;
    const elapsedTime = currentTime - orderTime;

    if (currentTime >= deliveryTime) {
      return { status: "delivered", progress: 100 };
    } else if (elapsedTime > totalTime * 0.5) {
      return { status: "shipped", progress: 50 };
    } else {
      return { status: "preparing", progress: 0 };
    }
  };

  if (loading) {
    return (
      <div>
        <title>Tracking</title>
        <Header cart={cart} />
        <div className="tracking-page">
          <div className="order-tracking">Loading...</div>
        </div>
      </div>
    );
  }

  if (!order || !productItem) {
    return (
      <div>
        <title>Tracking</title>
        <Header cart={cart} />
        <div className="tracking-page">
          <div className="order-tracking">
            <p>Order or product not found.</p>
            <Link to="/orders" className="back-to-orders-link link-primary">
              View all orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const trackingStatus = getTrackingStatus();
  const deliveryDate = dayjs(productItem.estimatedDeliveryTimeMs);

  return (
    <div>
      <title>Tracking</title>
      <Header cart={cart} />
      <div className="tracking-page">
        <div className="order-tracking">
          <Link to="/orders" className="back-to-orders-link link-primary">
            View all orders
          </Link>

          <div className="delivery-date">
            Arriving on {deliveryDate.format("dddd, MMMM D")}
          </div>

          <div className="product-info">{productItem.product.name}</div>

          <div className="product-info">Quantity: {productItem.quantity}</div>

          <img
            className="product-image"
            src={`/${productItem.product.image}`}
            alt={productItem.product.name}
          />

          <div className="progress-labels-container">
            <div
              className={`progress-label ${
                trackingStatus.status === "preparing" ? "current-status" : ""
              }`}>
              Preparing
            </div>
            <div
              className={`progress-label ${
                trackingStatus.status === "shipped" ? "current-status" : ""
              }`}>
              Shipped
            </div>
            <div
              className={`progress-label ${
                trackingStatus.status === "delivered" ? "current-status" : ""
              }`}>
              Delivered
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${trackingStatus.progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;

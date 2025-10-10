import React from "react";
import dayjs from "dayjs";

const OrderProduct = ({ item, onAddToCart }) => {
  return (
    <React.Fragment>
      <div className="product-image-container">
        <img src={`/${item.product.image}`} alt={item.product.name} />
      </div>

      <div className="product-details">
        <div className="product-name">{item.product.name}</div>
        <div className="product-delivery-date">
          Arriving on: {dayjs(item.estimatedDeliveryTimeMs).format("MMMM D")}
        </div>
        <div className="product-quantity">Quantity: {item.quantity}</div>
        <button
          className="buy-again-button button-primary"
          onClick={() => onAddToCart(item.productId)}
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
  );
};

export default OrderProduct;

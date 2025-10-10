import React from "react";
import OrderHeader from "./OrderHeader";
import OrderProduct from "./OrderProduct";

const OrderContainer = ({ order, onAddToCart }) => {
  return (
    <div className="order-container">
      <OrderHeader order={order} />

      <div className="order-details-grid">
        {order.products &&
          order.products.map((item) => (
            <OrderProduct
              key={item.productId}
              item={item}
              onAddToCart={onAddToCart}
            />
          ))}
      </div>
    </div>
  );
};

export default OrderContainer;

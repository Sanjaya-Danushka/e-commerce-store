import React from "react";
import OrderHeader from "./OrderHeader";
import OrderProduct from "./OrderProduct";

const OrderContainer = ({ order, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
      <OrderHeader order={order} />

      <div className="grid grid-cols-1 gap-4 mt-6">
        {order.products &&
          order.products.map((item) => (
            <OrderProduct
              key={item.productId}
              item={item}
              orderId={order.id}
              onAddToCart={onAddToCart}
            />
          ))}
      </div>
    </div>
  );
};

export default OrderContainer;

import React from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const OrderProduct = ({ item, orderId, onAddToCart }) => {
  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        <img
          src={`/${item.product.image}`}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.product.name}</h3>
        <p className="text-sm text-gray-600 mb-1">
          Arriving on: {dayjs(item.estimatedDeliveryTimeMs).format("MMMM D")}
        </p>
        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={() => onAddToCart(item.productId)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Add to Cart</span>
        </button>

        <Link to={`/tracking?orderId=${orderId}&productId=${item.productId}`}>
          <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors">
            Track package
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrderProduct;

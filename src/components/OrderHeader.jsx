import React from "react";
import dayjs from "dayjs";
import { formatMoney } from "../utils/money";

const OrderHeader = ({ order }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4">
      <div className="flex flex-col space-y-2 mb-4 md:mb-0">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">Order Placed:</span>
          <span className="font-semibold text-gray-900">{dayjs(order.orderTimeMs).format("MMMM D")}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600">Total:</span>
          <span className="font-bold text-lg text-green-600">{formatMoney(order.totalCostCents)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-600">Order ID:</span>
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{order.id}</span>
      </div>
    </div>
  );
};

export default OrderHeader;

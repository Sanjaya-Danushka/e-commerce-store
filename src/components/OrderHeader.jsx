import React, { useState } from "react";
import dayjs from "dayjs";
import { formatMoney } from "../utils/money";
import CancelOrderModal from "./CancelOrderModal";

const OrderHeader = ({ order, onOrderUpdate }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const canCancelOrder = ['preparing', 'processing'].includes(order.status);

  const handleCancelSuccess = () => {
    if (onOrderUpdate) {
      onOrderUpdate();
    }
  };

  return (
    <>
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
          {canCancelOrder && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <CancelOrderModal
        order={order}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onCancelSuccess={handleCancelSuccess}
      />
    </>
  );
};

export default OrderHeader;

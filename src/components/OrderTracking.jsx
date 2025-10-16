import React, { useState } from 'react';
import dayjs from 'dayjs';
import CancelOrderModal from './CancelOrderModal';

const OrderTracking = ({ order, onOrderUpdate }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Don't show tracking for pending orders
  if (order.status === 'pending') {
    return null;
  }

  const canCancelOrder = ['preparing', 'processing'].includes(order.status);

  const handleCancelSuccess = () => {
    if (onOrderUpdate) {
      onOrderUpdate();
    }
  };

  // Calculate progress percentage based on status
  const getProgressPercentage = () => {
    switch (order.status) {
      case 'processing':
        return 25;
      case 'shipped':
        return 75;
      case 'delivered':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (order.status) {
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get tracking stages based on status
  const getTrackingStages = () => {
    const baseStages = [
      {
        id: 'received',
        title: 'Order Received',
        description: 'Your order has been confirmed',
        completed: true,
        date: dayjs(order.orderTimeMs).format('MMM D, YYYY [at] h:mm A')
      },
      {
        id: 'processing',
        title: 'Processing Order',
        description: 'Your order is being prepared for shipment',
        completed: ['processing', 'shipped', 'delivered'].includes(order.status),
        date: order.status !== 'pending' && order.status !== 'cancelled' ? dayjs(order.orderTimeMs).add(1, 'hour').format('MMM D, YYYY [at] h:mm A') : null
      },
      {
        id: 'shipped',
        title: 'Shipped',
        description: 'Your package is on its way to you',
        completed: ['shipped', 'delivered'].includes(order.status),
        date: order.status === 'shipped' || order.status === 'delivered' ? dayjs(order.orderTimeMs).add(1, 'day').format('MMM D, YYYY [at] h:mm A') : null
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your package has been delivered',
        completed: order.status === 'delivered',
        date: order.status === 'delivered' ? dayjs(order.orderTimeMs).add(3, 'days').format('MMM D, YYYY [at] h:mm A') : null
      }
    ];

    // Add cancellation stage for cancelled orders
    if (order.status === 'cancelled') {
      return [
        ...baseStages.slice(0, 1), // Only keep the received stage
        {
          id: 'cancelled',
          title: 'Order Cancelled',
          description: order.cancellationReason ? `Reason: ${order.cancellationReason}${order.cancellationOtherReason ? ` - ${order.cancellationOtherReason}` : ''}` : 'Order has been cancelled',
          completed: true,
          date: order.cancelledAt ? dayjs(order.cancelledAt).format('MMM D, YYYY [at] h:mm A') : dayjs(order.updatedAt).format('MMM D, YYYY [at] h:mm A')
        }
      ];
    }

    return baseStages;
  };

  const progressPercentage = getProgressPercentage();
  const statusColor = getStatusColor();
  const trackingStages = getTrackingStages();

  return (
    <>
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mt-6 border border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">📦 Order Tracking</h3>
          <p className="text-sm text-gray-600">Track your package in real-time</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
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

      {/* Package Details */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">📋 Package Details</h4>
        <div className="space-y-2">
          {order.products?.map((product) => (
            <div key={product.productId} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                {product.product?.image && (
                  <img
                    src={`/${product.product.image}`}
                    alt={product.product?.name}
                    className="w-12 h-12 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.src = '/images/products/placeholder.jpg';
                    }}
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{product.product?.name || 'Product'}</p>
                  <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">📅 Order Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Order #</p>
            <p className="font-mono text-sm font-medium">#{order.id.slice(-8)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-medium">{dayjs(order.orderTimeMs).format('MMM D, YYYY')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimated Delivery</p>
            <p className="font-medium">
              {order.products?.[0]?.estimatedDeliveryTimeMs
                ? dayjs(order.products[0].estimatedDeliveryTimeMs).format('MMM D, YYYY')
                : 'TBD'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Delivery Progress</span>
          <span className="text-sm text-gray-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              order.status === 'delivered' ? 'bg-green-500' :
              order.status === 'shipped' ? 'bg-purple-500' :
              order.status === 'processing' ? 'bg-blue-500' :
              order.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-300'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tracking Stages */}
      <div className="space-y-4">
        {trackingStages.map((stage) => (
          <div key={stage.id} className="flex items-start space-x-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              stage.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {stage.completed ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <div className="w-2 h-2 bg-current rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-medium ${stage.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                  {stage.title}
                </h4>
                {stage.date && (
                  <span className="text-xs text-gray-500">{stage.date}</span>
                )}
              </div>
              <p className={`text-sm ${stage.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                {stage.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Cancel Order Modal */}
    <CancelOrderModal
      order={order}
      isOpen={showCancelModal}
      onClose={() => setShowCancelModal(false)}
      onCancelSuccess={handleCancelSuccess}
    />
    </>
  );
};

export default OrderTracking;

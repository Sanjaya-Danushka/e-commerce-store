import React, { useState } from 'react';
import axios from 'axios';

const ReturnOrderModal = ({ order, isOpen, onClose, onReturnSuccess }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const returnReasons = [
    'Wrong item received',
    'Item damaged or defective',
    'Item not as described',
    'Changed my mind',
    'Does not fit',
    'Quality not as expected',
    'Received duplicate item',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const reason = selectedReason === 'Other' ? 'Other' : selectedReason;
      const otherReasonText = selectedReason === 'Other' ? otherReason : null;

      await axios.put(`/api/orders/${order.id}/return`, {
        reason,
        otherReason: otherReasonText
      });

      onReturnSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to process return request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setOtherReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Return Order</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Order #{order.id.slice(-8)}</p>
          <p className="text-sm text-gray-500">
            Requesting a return will initiate our return process. We'll review your request and provide return instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Why are you returning this order?
            </label>
            <div className="space-y-2">
              {returnReasons.map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="returnReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Other' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify your reason
              </label>
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="Please provide details about why you're returning this item..."
                required={selectedReason === 'Other'}
              />
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Keep Order
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-400"
              disabled={isSubmitting || !selectedReason}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Request Return'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnOrderModal;

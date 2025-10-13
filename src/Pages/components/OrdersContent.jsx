import React, { useState, useEffect, useCallback } from 'react';
import adminAPI from '../../services/adminAPI';

const OrdersContent = ({ theme }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersByStatus: []
  });

  // Fetch orders
  const fetchOrders = useCallback(async (page = 1, search = '', status = '') => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sortBy: 'orderTimeMs',
        sortOrder: 'DESC'
      };

      if (search) params.search = search;
      if (status) params.status = status;

      const response = await adminAPI.getOrders(params);
      setOrders(response.orders || []);
      setTotalPages(response.pagination?.pages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch order statistics
  const fetchOrderStats = useCallback(async () => {
    try {
      const response = await adminAPI.getOrderStats();
      setOrderStats(response);
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter);
    fetchOrderStats();
  }, [currentPage, searchTerm, statusFilter, fetchOrders, fetchOrderStats]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrder(orderId, { status: newStatus });
      fetchOrders(currentPage, searchTerm, statusFilter);
      fetchOrderStats();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  // Handle order view
  const handleViewOrder = async (order) => {
    try {
      const orderDetails = await adminAPI.getOrder(order.id);
      setSelectedOrder(orderDetails);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to fetch order details');
    }
  };

  // Handle order delete
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await adminAPI.deleteOrder(orderId);
        fetchOrders(currentPage, searchTerm, statusFilter);
        fetchOrderStats();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className={`text-5xl font-bold ${theme.text} mb-10`}>Order Management</h2>
      </div>

      {/* Order Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${theme.card} ${theme.border} rounded-3xl p-6 ${theme.shadow}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${theme.textSecondary} text-sm`}>Total Orders</p>
              <p className={`text-3xl font-bold ${theme.text}`}>{orderStats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              📦
            </div>
          </div>
        </div>

        <div className={`${theme.card} ${theme.border} rounded-3xl p-6 ${theme.shadow}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${theme.textSecondary} text-sm`}>Total Revenue</p>
              <p className={`text-3xl font-bold ${theme.text}`}>{formatCurrency(orderStats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              💰
            </div>
          </div>
        </div>

        <div className={`${theme.card} ${theme.border} rounded-3xl p-6 ${theme.shadow}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${theme.textSecondary} text-sm`}>Average Order Value</p>
              <p className={`text-3xl font-bold ${theme.text}`}>{formatCurrency(orderStats.averageOrderValue)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              📊
            </div>
          </div>
        </div>

        <div className={`${theme.card} ${theme.border} rounded-3xl p-6 ${theme.shadow}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${theme.textSecondary} text-sm`}>Recent Orders</p>
              <p className={`text-3xl font-bold ${theme.text}`}>{orderStats.recentOrders}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              🕐
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${theme.card} ${theme.border} rounded-3xl p-6 ${theme.shadow}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block ${theme.text} font-semibold mb-2`}>Search Orders</label>
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={handleSearch}
              className={`${theme.input} w-full rounded-lg px-4 py-3`}
            />
          </div>
          <div>
            <label className={`block ${theme.text} font-semibold mb-2`}>Filter by Status</label>
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className={`${theme.input} w-full rounded-lg px-4 py-3`}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => fetchOrders(currentPage, searchTerm, statusFilter)}
              className={`${theme.button} w-full text-white py-3 px-6 rounded-lg font-semibold`}
            >
              🔍 Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className={`${theme.card} ${theme.border} rounded-3xl ${theme.shadow} overflow-hidden`}>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className={`${theme.textSecondary} mt-4`}>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className={`${theme.textSecondary} text-lg`}>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${theme.background} ${theme.border} border-b`}>
                <tr>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Order ID</th>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Customer</th>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Date</th>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Status</th>
                  <th className={`px-6 py-4 text-left ${theme.text} font-semibold`}>Total</th>
                  <th className={`px-6 py-4 text-center ${theme.text} font-semibold`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className={`${theme.border} border-b hover:bg-opacity-50 transition-colors`}>
                    <td className={`px-6 py-4 ${theme.text} font-mono font-medium`}>
                      #{order.id.slice(-8)}
                    </td>
                    <td className={`px-6 py-4 ${theme.text}`}>
                      <div>
                        <p className="font-medium">
                          {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p className={`${theme.textSecondary} text-sm`}>
                          {order.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${theme.textSecondary}`}>
                      {formatDate(order.orderTimeMs)}
                    </td>
                    <td className={`px-6 py-4`}>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} border-0`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className={`px-6 py-4 ${theme.text} font-semibold`}>
                      {formatCurrency(order.totalCostCents)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 ${theme.button} text-white rounded-lg disabled:opacity-50`}
            >
              ⬅️ Previous
            </button>
            <span className={`px-4 py-2 ${theme.text}`}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 ${theme.button} text-white rounded-lg disabled:opacity-50`}
            >
              Next ➡️
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.card} ${theme.border} rounded-3xl p-8 ${theme.shadow} w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-3xl font-bold ${theme.text}`}>
                Order Details #{selectedOrder.id.slice(-8)}
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className={`text-2xl ${theme.textSecondary} hover:${theme.text}`}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Info */}
              <div className="space-y-6">
                <div>
                  <h4 className={`text-xl font-bold ${theme.text} mb-4`}>Order Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`${theme.textSecondary}`}>Order Date:</span>
                      <span className={`${theme.text}`}>{formatDate(selectedOrder.orderTimeMs)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textSecondary}`}>Status:</span>
                      <select
                        value={selectedOrder.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)} border-0`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${theme.textSecondary}`}>Total Amount:</span>
                      <span className={`text-xl font-bold ${theme.text}`}>{formatCurrency(selectedOrder.totalCostCents)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h4 className={`text-xl font-bold ${theme.text} mb-4`}>Customer Information</h4>
                  <div className="space-y-2">
                    <p className={`${theme.text}`}>
                      <span className={`${theme.textSecondary}`}>Name:</span> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                    </p>
                    <p className={`${theme.text}`}>
                      <span className={`${theme.textSecondary}`}>Email:</span> {selectedOrder.user?.email}
                    </p>
                    {selectedOrder.user?.phoneNumber && (
                      <p className={`${theme.text}`}>
                        <span className={`${theme.textSecondary}`}>Phone:</span> {selectedOrder.user.phoneNumber}
                      </p>
                    )}
                    {selectedOrder.user?.addressLine1 && (
                      <div className={`${theme.text}`}>
                        <span className={`${theme.textSecondary}`}>Address:</span>
                        <div className="mt-1">
                          {selectedOrder.user.addressLine1}
                          {selectedOrder.user.addressLine2 && <div>{selectedOrder.user.addressLine2}</div>}
                          <div>{selectedOrder.user.city}, {selectedOrder.user.state} {selectedOrder.user.postalCode}</div>
                          <div>{selectedOrder.user.country}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className={`text-xl font-bold ${theme.text} mb-4`}>Order Items</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedOrder.products?.map((product, index) => (
                    <div key={index} className={`${theme.border} border rounded-lg p-4`}>
                      <div className="flex items-start gap-4">
                        {product.product?.image && (
                          <img
                            src={`/${product.product.image}`}
                            alt={product.product?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = '/images/products/placeholder.jpg';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h5 className={`font-semibold ${theme.text}`}>
                            {product.product?.name || 'Product not found'}
                          </h5>
                          <p className={`${theme.textSecondary}`}>
                            Quantity: {product.quantity}
                          </p>
                          {product.product && (
                            <p className={`${theme.textSecondary}`}>
                              Price: {formatCurrency(product.product.priceCents)} each
                            </p>
                          )}
                          {product.estimatedDeliveryTimeMs && (
                            <p className={`${theme.textSecondary} text-sm`}>
                              Est. Delivery: {formatDate(product.estimatedDeliveryTimeMs)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowOrderModal(false)}
                className={`px-6 py-3 ${theme.border} border ${theme.text} rounded-lg font-semibold hover:scale-105 transition-all duration-200`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersContent;

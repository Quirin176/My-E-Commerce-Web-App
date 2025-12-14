import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChevronDown,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Mail,
} from "lucide-react";
import { adminOrdersApi } from "../../api/adminOrdersApi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "desc",
  });

  // Filter states
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Stats
  const [stats, setStats] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    status: "",
    notes: "",
  });

  // Status options
  const STATUS_OPTIONS = [
    { value: "Pending", label: "Pending", color: "yellow" },
    { value: "Confirmed", label: "Confirmed", color: "blue" },
    { value: "Processing", label: "Processing", color: "purple" },
    { value: "Shipped", label: "Shipped", color: "purple" },
    { value: "Delivered", label: "Delivered", color: "green" },
    { value: "Cancelled", label: "Cancelled", color: "red" },
    { value: "Refunded", label: "Refunded", color: "gray" },
  ];

  // Load orders
  useEffect(() => {
    loadOrders();
    loadStats();
  }, [statusFilter, minDate, maxDate]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminOrdersApi.getAllOrders({
        status: statusFilter === "all" ? null : statusFilter,
        minDate: minDate || null,
        maxDate: maxDate || null,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      });

      setOrders(Array.isArray(data) ? data : []);
      console.log("Orders loaded:", data);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await adminOrdersApi.getOrderStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  // Filter orders by search term
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toString().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm);

      return matchesSearch;
    });
  }, [orders, searchTerm]);

  const getStatusColor = (status) => {
    const statusObj = STATUS_OPTIONS.find((s) => s.value === status);
    const colorMap = {
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
      blue: "bg-blue-100 text-blue-800 border-blue-300",
      purple: "bg-purple-100 text-purple-800 border-purple-300",
      green: "bg-green-100 text-green-800 border-green-300",
      red: "bg-red-100 text-red-800 border-red-300",
      gray: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return colorMap[statusObj?.color] || colorMap.gray;
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminOrdersApi.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      await adminOrdersApi.deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditForm({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      city: order.city,
      status: order.status,
      notes: order.notes || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await adminOrdersApi.updateOrder(selectedOrder.id, editForm);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? { ...order, ...editForm } : order
        )
      );
      setShowEditModal(false);
      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const handleExportOrders = async () => {
    try {
      const blob = await adminOrdersApi.exportOrders(
        statusFilter === "all" ? null : statusFilter
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Orders exported successfully");
    } catch (error) {
      console.error("Error exporting orders:", error);
      toast.error("Failed to export orders");
    }
  };

  const handleSendEmail = async (orderId) => {
    try {
      await adminOrdersApi.sendConfirmationEmail(orderId);
      toast.success("Confirmation email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportOrders}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => setShowStatsModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
          >
            <BarChart3 size={18} />
            Statistics
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-4 rounded shadow-sm mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-2 items-end">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              From Date
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={minDate}
              onChange={(e) => setMinDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              To Date
            </label>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={maxDate}
              onChange={(e) => setMaxDate(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setMinDate("");
              setMaxDate("");
            }}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition text-sm font-semibold"
          >
            Clear Dates
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <span className="font-semibold text-gray-700">Filter by Status:</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Orders
            </button>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  statusFilter === status.value
                    ? `${getStatusColor(status.value)} border-2`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ORDERS TABLE */}
      {loading ? (
        <p className="text-center py-8 text-gray-500">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded shadow-sm p-8 text-center">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th
                    className="px-6 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("id")}
                  >
                    Order ID {sortConfig.key === "id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-right font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("totalAmount")}
                  >
                    Total {sortConfig.key === "totalAmount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-center font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("orderDate")}
                  >
                    Date {sortConfig.key === "orderDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`border-b ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {order.customerEmail}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full font-semibold border-2 cursor-pointer transition ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      {order.totalAmount.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 text-sm">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-semibold text-sm"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition font-semibold text-sm"
                        title="Edit Order"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleSendEmail(order.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition font-semibold text-sm"
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition font-semibold text-sm"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION INFO */}
          <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedOrder && (
        <OrderEditModal
          order={selectedOrder}
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
          statusOptions={STATUS_OPTIONS}
        />
      )}

      {/* STATS MODAL */}
      {showStatsModal && stats && (
        <OrderStatsModal stats={stats} onClose={() => setShowStatsModal(false)} />
      )}
    </div>
  );
}

// Detail Modal Component
function OrderDetailModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order #{order.id}</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-bold mb-3">Customer Info</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {order.customerName}
              </p>
              <p>
                <strong>Email:</strong> {order.customerEmail}
              </p>
              <p>
                <strong>Phone:</strong> {order.customerPhone}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">Order Info</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-bold mb-4">Order Items</h3>
          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  {item.totalPrice.toLocaleString()} VND
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
          <div className="flex justify-between">
            <span className="font-bold">Total:</span>
            <span className="text-blue-600 font-bold text-lg">
              {order.totalAmount.toLocaleString()} VND
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Edit Modal Component
function OrderEditModal({
  order,
  editForm,
  setEditForm,
  onSave,
  onClose,
  statusOptions,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Order #{order.id}</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Customer Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editForm.customerName}
              onChange={(e) =>
                setEditForm({ ...editForm, customerName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              value={editForm.customerEmail}
              onChange={(e) =>
                setEditForm({ ...editForm, customerEmail: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="tel"
              className="w-full border p-2 rounded"
              value={editForm.customerPhone}
              onChange={(e) =>
                setEditForm({ ...editForm, customerPhone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Address</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editForm.shippingAddress}
              onChange={(e) =>
                setEditForm({ ...editForm, shippingAddress: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">City</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editForm.city}
              onChange={(e) =>
                setEditForm({ ...editForm, city: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Status</label>
            <select
              className="w-full border p-2 rounded"
              value={editForm.status}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Notes</label>
            <textarea
              className="w-full border p-2 rounded"
              rows="3"
              value={editForm.notes}
              onChange={(e) =>
                setEditForm({ ...editForm, notes: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 py-2 rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Stats Modal Component
function OrderStatsModal({ stats, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order Statistics</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalOrders}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalRevenue.toLocaleString()} VND
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded border border-purple-200">
            <p className="text-sm text-gray-600">Avg Order Value</p>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(stats.averageOrderValue).toLocaleString()} VND
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-3">Orders by Status</h3>
            <div className="space-y-2">
              {stats.byStatus?.map((item) => (
                <div
                  key={item.status}
                  className="flex justify-between p-2 bg-gray-50 rounded"
                >
                  <span>{item.status}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">Orders by Payment Method</h3>
            <div className="space-y-2">
              {stats.byPaymentMethod?.map((item) => (
                <div
                  key={item.method}
                  className="flex justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="capitalize">{item.method}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Last 30 Days Orders</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.last30DaysOrders}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last 30 Days Revenue</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.last30DaysRevenue.toLocaleString()} VND
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDown, Search, Filter, Download, Eye } from "lucide-react";
import { adminApi } from "../../api/adminApi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Status options for filtering and updating
  const STATUS_OPTIONS = [
    { value: "Pending", label: "Pending", color: "yellow" },
    { value: "Processing", label: "Processing", color: "blue" },
    { value: "Shipped", label: "Shipped", color: "purple" },
    { value: "Delivered", label: "Delivered", color: "green" },
    { value: "Cancelled", label: "Cancelled", color: "red" },
    { value: "Refunded", label: "Refunded", color: "gray" },
  ];

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual endpoint
      const mockOrders = [
        {
          id: 1001,
          orderNumber: "ORD-2024-001",
          customer: { name: "John Doe", email: "john@example.com", phone: "0123456789" },
          status: "Pending",
          total: 2500000,
          itemCount: 3,
          createdAt: new Date("2024-01-15"),
          items: [
            { productId: 1, productName: "Laptop Dell XPS", quantity: 1, price: 2000000 },
            { productId: 2, productName: "USB Mouse", quantity: 2, price: 250000 }
          ]
        },
        {
          id: 1002,
          orderNumber: "ORD-2024-002",
          customer: { name: "Jane Smith", email: "jane@example.com", phone: "0987654321" },
          status: "Processing",
          total: 1500000,
          itemCount: 2,
          createdAt: new Date("2024-01-14"),
          items: [
            { productId: 3, productName: "Monitor 27 inch", quantity: 1, price: 1500000 }
          ]
        },
        {
          id: 1003,
          orderNumber: "ORD-2024-003",
          customer: { name: "Bob Johnson", email: "bob@example.com", phone: "0555666777" },
          status: "Shipped",
          total: 750000,
          itemCount: 1,
          createdAt: new Date("2024-01-13"),
          items: [
            { productId: 4, productName: "Mechanical Keyboard", quantity: 1, price: 750000 }
          ]
        },
        {
          id: 1004,
          orderNumber: "ORD-2024-004",
          customer: { name: "Alice Brown", email: "alice@example.com", phone: "0111222333" },
          status: "Delivered",
          total: 3200000,
          itemCount: 4,
          createdAt: new Date("2024-01-12"),
          items: [
            { productId: 5, productName: "Wireless Mouse", quantity: 2, price: 500000 },
            { productId: 6, productName: "USB Hub", quantity: 2, price: 600000 }
          ]
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Sort orders
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredOrders, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc"
    }));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update order status
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const statusObj = STATUS_OPTIONS.find(s => s.value === status);
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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleExportOrders = () => {
    const csv = [
      ["Order ID", "Order Number", "Customer", "Email", "Status", "Total (VND)", "Items", "Created At"],
      ...sortedOrders.map(order => [
        order.id,
        order.orderNumber,
        order.customer.name,
        order.customer.email,
        order.status,
        order.total,
        order.itemCount,
        order.createdAt.toISOString().split('T')[0]
      ])
    ];

    const csvContent = csv.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Orders exported successfully");
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <button
          onClick={handleExportOrders}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-4 rounded shadow-sm mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer name or email..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
            {STATUS_OPTIONS.map(status => (
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
      ) : sortedOrders.length === 0 ? (
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
                    onClick={() => handleSort("orderNumber")}
                  >
                    Order # {sortConfig.key === "orderNumber" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  <th
                    className="px-6 py-3 text-right font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("total")}
                  >
                    Total {sortConfig.key === "total" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-6 py-3 text-center font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("createdAt")}
                  >
                    Date {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order, idx) => (
                  <tr key={order.id} className={`border-b ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                    <td className="px-6 py-4 font-semibold text-blue-600">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-gray-700">{order.customer.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{order.customer.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full font-semibold border-2 cursor-pointer transition ${getStatusColor(order.status)}`}
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      {order.total.toLocaleString()} VND
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 text-sm">
                      {order.createdAt.toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-semibold text-sm"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION INFO */}
          <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600">
            Showing {sortedOrders.length} of {orders.length} orders
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedOrder.orderNumber}</h2>
                <p className="text-blue-100 text-sm">
                  {selectedOrder.createdAt.toISOString().split('T')[0]}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-2xl hover:text-blue-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="border-b pb-6">
                <h3 className="font-bold text-gray-800 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Name</label>
                    <p className="text-gray-800">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <p className="text-gray-800">{selectedOrder.customer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone</label>
                    <p className="text-gray-800">{selectedOrder.customer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Status</label>
                    <p className={`inline-block px-3 py-1 rounded-full font-semibold border-2 ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-b pb-6">
                <h3 className="font-bold text-gray-800 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.productName}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {(item.price * item.quantity).toLocaleString()} VND
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">Total Amount:</span>
                  <span className="font-bold text-2xl text-blue-600">
                    {selectedOrder.total.toLocaleString()} VND
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { checkoutApi } from "../../api/checkoutApi";
import toast from "react-hot-toast";
import { ChevronDown, Edit, Eye, Trash2 } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const statusOptions = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

  // Load all orders
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        // Assuming you have this endpoint
        const data = await fetch("http://localhost:5159/api/orders/admin/all-orders", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }).then(r => r.json());

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === selectedStatus));
    }
  }, [orders, selectedStatus]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5159/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      setEditingOrderId(null);
      toast.success("Order status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-800 font-semibold text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === "Pending").length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-semibold text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === "Confirmed").length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-800 font-semibold text-sm">Shipped</p>
          <p className="text-2xl font-bold text-purple-600">
            {orders.filter(o => o.status === "Shipped").length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800 font-semibold text-sm">Delivered</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === "Delivered").length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-semibold text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600">
            {orders.length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded font-semibold transition ${
              selectedStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {status === "all" ? "All Orders" : status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No orders found</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow">
              {/* Order Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between"
                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-bold text-gray-800">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.customerName} | {order.customerEmail}</p>
                </div>

                <div className="text-right mr-4">
                  <p className="font-bold text-blue-600">{order.totalAmount.toLocaleString()} VND</p>
                  <p className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>

                <ChevronDown
                  size={20}
                  className={`text-gray-600 transition ${expandedOrderId === order.id ? "rotate-180" : ""}`}
                />
              </div>

              {/* Order Details */}
              {expandedOrderId === order.id && (
                <div className="border-t p-4 bg-gray-50">
                  {/* Customer Info */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-bold mb-2">Customer Info</h4>
                      <p className="text-sm text-gray-700">{order.customerName}</p>
                      <p className="text-sm text-gray-700">{order.customerEmail}</p>
                      <p className="text-sm text-gray-700">{order.customerPhone}</p>
                    </div>

                    <div>
                      <h4 className="font-bold mb-2">Status Management</h4>
                      {editingOrderId === order.id ? (
                        <div className="flex gap-2">
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border p-1 rounded text-sm flex-1"
                          >
                            {statusOptions.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleStatusUpdate(order.id, newStatus)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingOrderId(null)}
                            className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingOrderId(order.id);
                            setNewStatus(order.status);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded">
                            <div>
                              <p className="font-semibold">{item.productName}</p>
                              <p className="text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">{item.totalPrice.toLocaleString()} VND</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm">
                      <Eye size={16} /> View Details
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 text-sm">
                      <Trash2 size={16} /> Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

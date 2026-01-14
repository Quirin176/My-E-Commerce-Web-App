import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkoutApi } from "../../api/checkoutApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ChevronDown, Eye, Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all"); // all, pending, confirmed, shipped, delivered

  // Fetch user orders
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await checkoutApi.getUserOrders();
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

    if (user) {
      loadOrders();
    }
  }, [user]);

  // Filter orders by status
  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(o => o.status.toLowerCase() === selectedStatus.toLowerCase());

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return <Clock size={20} className="text-yellow-500" />;
      case "confirmed":
        return <CheckCircle size={20} className="text-blue-500" />;
      case "shipped":
        return <Truck size={20} className="text-purple-500" />;
      case "delivered":
        return <CheckCircle size={20} className="text-green-500" />;
      case "cancelled":
        return <Package size={20} className="text-red-500" />;
      default:
        return <Package size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Please Login First</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to view your orders</p>
        <button
          onClick={() => navigate("/auth/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-600">Track your orders and manage purchases</p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedStatus(option.value)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedStatus === option.value
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {option.label}
            {option.value !== "all" && (
              <span className="ml-2 text-sm">
                ({orders.filter(o => o.status.toLowerCase() === option.value.toLowerCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 mt-4">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-4">
            {selectedStatus === "all" ? "No orders yet" : `No ${selectedStatus} orders`}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              {/* Order Header - Always Visible */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* Order Number and Date */}
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="text-lg font-bold text-gray-800">#{order.id}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-semibold text-sm capitalize">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items Count */}
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="text-lg font-bold text-gray-800">
                      {order.itemCount}
                    </p>
                  </div>

                  {/* Total Amount */}
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold text-blue-600">
                      {order.totalAmount.toLocaleString()} VND
                    </p>
                  </div>

                  {/* Expand Arrow */}
                  <div className="flex justify-end md:justify-center">
                    <ChevronDown
                      size={24}
                      className={`text-gray-600 transition ${
                        expandedOrderId === order.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Order Details - Expandable */}
              {expandedOrderId === order.id && (
                <div className="border-t p-6 bg-gray-50">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3">Shipping Information</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>Name:</strong> {order.customerName}</p>
                        <p><strong>Email:</strong> {order.customerEmail}</p>
                        <p><strong>Phone:</strong> {order.customerPhone}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 mb-3">Payment Information</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>Method:</strong> <span className="capitalize">{order.paymentMethod}</span></p>
                        <p><strong>Amount:</strong> {order.totalAmount.toLocaleString()} VND</p>
                        <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items - Only show if we have item details */}
                  {order.items && order.items.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 mb-3">Order Items</h4>
                      <div className="space-y-2 bg-white rounded p-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm pb-2 border-b last:border-b-0">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{item.productName}</p>
                              <p className="text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-800">
                                {item.totalPrice.toLocaleString()} VND
                              </p>
                              <p className="text-gray-600 text-xs">
                                {item.unitPrice.toLocaleString()} VND each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      <Eye size={18} />
                      View Details
                    </button>

                    {order.status.toLowerCase() === "shipped" && (
                      <button
                        onClick={() => toast.success("Tracking info: Coming soon!")}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                      >
                        <Truck size={18} />
                        Track Shipment
                      </button>
                    )}

                    {order.status.toLowerCase() === "pending" && (
                      <button
                        onClick={() => toast.success("Cancellation feature coming soon!")}
                        className="px-4 py-2 border-2 border-red-600 text-red-600 rounded hover:bg-red-50 transition"
                      >
                        Cancel Order
                      </button>
                    )}
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

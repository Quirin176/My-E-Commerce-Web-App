import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Package } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { checkoutApi } from "../../api/checkoutApi";
import type { OrderResponseModel } from "../../types/models/order/OrderResponseModel";
import UserOrderCard from "../../components/User/UserOrderCard";
import { siteConfig } from "../../config/siteConfig";

export default function UserOrders() {
  const orderStatus = siteConfig.ORDER_STATUS_OPTIONS;

  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderResponseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("all");

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

  // Sort orders by status
  const sortedOrders = sortBy === "all" ? orders : orders.filter(o => o.status.trim().toLowerCase() === sortBy.trim().toLowerCase());

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
        {orderStatus.map((option) => (
          <button
            key={option.value}
            onClick={() => setSortBy(option.value.toLowerCase())}
            className={`px-4 py-2 rounded-full font-semibold transition ${sortBy === option.value
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {option.label}
            <span className="ml-2 text-sm">
              {option.value.toLowerCase() === "all"
                ? `(${orders.length})`
                : `(${orders.filter(o => o.status.toLowerCase() === option.value.toLowerCase()).length})`}
            </span>
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
      ) : sortedOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-4">
            {sortBy === "all" ? "No orders yet" : `No ${sortBy} orders`}
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
          {sortedOrders.map((order) => (
            <UserOrderCard
            key={order.id}
            {...order}
            onDeleteSuccess={(id) => setOrders(prev => prev.filter(o => o.id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
}

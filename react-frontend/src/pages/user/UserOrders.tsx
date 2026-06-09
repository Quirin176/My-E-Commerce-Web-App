import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Package } from "lucide-react";
import { useAuth } from "../../hooks/auth/useAuth";
import { orderApi } from "../../api/user/orderApi";
import type { OrderResponse } from "../../types/models/order/OrderResponse";
import UserOrderCard from "../../components/orders/UserOrderCard";
import { ORDER_STATUS_CONFIG } from "../../types/orderStatus";

export default function UserOrders() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("all");

  const orderStatusOptions = [
    {
      value: "all",
      label: "All",
      icon: Package,
      badgeColor: "bg-gray-100 text-gray-800",
    },
    ...Object.entries(ORDER_STATUS_CONFIG).map(([status, config]) => ({
      value: status,
      label: status,
      icon: config.icon,
      badgeColor: config.badgeColor,
    })),
  ];

  // Fetch user orders
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await orderApi.getUserAllOrders();
        setOrders(Array.isArray(data) ? data : []);
        console.log(data);
      } catch (error) {
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
  const filteredOrders =
    sortBy === "all" ? orders :
      orders.filter(
        (o) =>
          o.status.trim().toLowerCase() ===
          sortBy.trim().toLowerCase()
      );

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
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">Track your orders and manage purchases</p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {orderStatusOptions.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${sortBy === option.value
                ? "bg-blue-600 text-white shadow-md"
                : `${option.badgeColor} hover:opacity-80`
                }`}
            >
              <Icon size={16} />

              <span>{option.label}</span>

              <span>
                {option.value === "all"
                  ? `(${orders.length})`
                  : `(${orders.filter(
                    (o) =>
                      o.status.toLowerCase() ===
                      option.value.toLowerCase()
                  ).length
                  })`}
              </span>
            </button>
          );
        })}
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
          {filteredOrders.map((order) => (
            <UserOrderCard
              key={order.id}
              {...order}
              onCancelSuccess={(id) => setOrders(prev => prev.filter(o => o.id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
}

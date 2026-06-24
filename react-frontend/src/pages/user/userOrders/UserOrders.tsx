import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Package } from "lucide-react";
import { useAuth } from "../../../hooks/auth/useAuth";
import { orderApi } from "../../../api/user/orderApi";
import type { OrderResponse } from "../../../types/models/order/OrderResponse";
import StatusTabs from "../../../components/StatusTabs";
import UserOrderCard from "../../../components/orders/UserOrderCard";
import type { OrderStatus } from "../../../types/orderStatus";

export default function UserOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>("all");

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await orderApi.getUserAllOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleOrderUpdate = async () => {
    // Refetch a single order from state — or simply refetch all.
    await orderApi.getUserAllOrders().then((data) => {
      setOrders(Array.isArray(data) ? data : []);
    }).catch(() => {
      toast.error("Failed to refresh orders");
    });
  };

  const filteredOrders =
    activeStatus === "all"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === activeStatus.toLowerCase());

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Please Login First</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to view your orders</p>
        <button
          onClick={() => navigate("/auth?mode=login")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 text-(--brand-primary)">My Orders</h1>
        <p className="font-medium">Track your orders and manage purchases</p>
      </div>

      {/* Status filters */}
      <StatusTabs
        activeStatus={activeStatus as "all" | OrderStatus}
        onStatusChange={setActiveStatus}
        getCount={(status) => status === "all" ? orders.length : orders.filter(
          (o) => o.status.toLowerCase() === status.toLowerCase()
        ).length
        }
      />

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-500 mt-4">Loading your orders…</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />

          <p className="text-gray-600 text-lg mb-4">
            {activeStatus === "all" ? "No orders yet" : `No ${activeStatus} orders`}
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredOrders.map((order) => (
            <div className="rounded-2xl border bg-(--bg-surface) hover:bg-(--bg-muted) transition">
              <UserOrderCard
                key={order.id}
                {...order}
                onCancelSuccess={(id) => setOrders((prev) => prev.filter((o) => o.id !== id))}
                onUpdateSuccess={handleOrderUpdate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Package } from "lucide-react";
import { adminOrdersApi } from "../../api/admin/adminOrdersApi";
import UserOrderCard from "../../components/User/UserOrderCard";
import type { OrderResponseModel } from "../../types/models/order/OrderResponseModel";
import { siteConfig } from "../../config/siteConfig";

export default function AdminOrders() {
    // Status options
    const orderStatus = siteConfig.ORDER_STATUS_OPTIONS;

    const [orders, setOrders] = useState<OrderResponseModel[]>([]);
    const [loading, setLoading] = useState(false);

    //Filter states
    const [status, setStatus] = useState("");
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    // Load orders
    useEffect(() => {
        loadOrders();
        // loadStats();
    }, [status, minDate, maxDate]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const response = await adminOrdersApi.getAllOrders(
                status,
                minDate,
                maxDate,
                sortBy,
                sortOrder,
            );
            console.log(response);

            setOrders(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Error loading orders:", error);
            toast.error("Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
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
                                : `(${orders.filter((o) => o.status.toLowerCase() === option.value.toLowerCase()).length})`}
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
            ) : orderStatus.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg mb-4">
                        {sortBy === "all" ? "No orders yet" : `No ${sortBy} orders`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
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

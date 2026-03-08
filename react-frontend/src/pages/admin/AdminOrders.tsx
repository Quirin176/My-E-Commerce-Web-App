import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Package, Download, Loader } from "lucide-react";
import { adminOrdersApi } from "../../api/admin/adminOrdersApi";
import UserOrderCard from "../../components/User/UserOrderCard";
import type { OrderResponseModel } from "../../types/models/order/OrderResponseModel";
import { siteConfig } from "../../config/siteConfig";

interface orderStatusCount {
    status: string;
    count: number;
}

export default function AdminOrders() {
    // Status options
    const orderStatus = siteConfig.ORDER_STATUS_OPTIONS;

    // Order stats
    const [orderStatusCount, setOrderStatusCount] = useState<orderStatusCount[]>([]);
    const [orderAllCount, setOrderAllCount] = useState(0);

    // Display orders in admin order management page
    const [orders, setOrders] = useState<OrderResponseModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    //Filter states
    const [status, setStatus] = useState("all");
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const stats = await adminOrdersApi.getOrderStats();
            setOrderStatusCount(stats.byStatus ?? []);
            setOrderAllCount(stats.totalOrders ?? 0);
        } catch (error) {
            console.error("Error loading order stats:", error);
            toast.error("Failed to load order statistics");
        }
    };

    // Load orders
    useEffect(() => {
        loadOrders();
    }, [status, minDate, maxDate, sortBy, sortOrder]);

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

            setOrders(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Error loading orders:", error);
            toast.error("Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // ========== CSV EXPORT ==========
    const handleExportCSV = async () => {
        setExporting(true);
        try {
            // Pass the current status filter (null means all)
            const exportStatus = status === "all" ? "" : status;
            const blob = await adminOrdersApi.exportOrders(exportStatus, minDate, maxDate, sortBy, sortOrder);

            // Create a download link and trigger it
            const url = window.URL.createObjectURL(new Blob([blob], { type: "text/csv" }));
            const link = document.createElement("a");
            link.href = url;

            // Build filename with current filter info and timestamp
            const dateStr = new Date().toISOString().slice(0, 10);
            const statusSuffix = status === "all" ? "all" : status;
            link.setAttribute("download", `orders_${statusSuffix}_${dateStr}.csv`);

            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`Exported ${orders.length} orders to CSV`);
        } catch (error) {
            console.error("Error exporting orders:", error);
            toast.error("Failed to export orders");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            {/* Title */}

            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Admin Orders Management</h1>

                <div className="flex flex-row gap-10">
                    <div className="flex flex-row items-center gap-4">
                        <label className="font-bold w-full">Select Start Date</label>
                        <input
                            type="date"
                            value={minDate}
                            onChange={(e) => setMinDate(e.target.value)}
                            className="border-2 rounded-xl px-2 py-1 w-full max-w-xs"
                        />
                    </div>

                    <div className="flex flex-row items-center gap-4">
                        <label className="font-bold w-full">Select End Date</label>
                        <input
                            type="date"
                            value={maxDate}
                            onChange={(e) => setMaxDate(e.target.value)}
                            className="border-2 rounded-xl px-2 py-1 w-full max-w-xs"
                        />
                    </div>
                </div>

                <select name="sort" id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border-2 rounded-xl px-2 py-1">
                    <option value="" onClick={() => setSortBy("")}
                    >Sort By</option>
                    <option value="customerName" onClick={() => setSortBy("customerName")}  // Must match the sortBy value ("customerName") in backend controller
                    >Customer Name</option>
                    <option value="totalAmount" onClick={() => setSortBy("totalAmount")}    // Must match the sortBy value ("totalAmount") in backend controller
                    >Total Amount</option>
                    <option value="orderDate" onClick={() => setSortBy("orderDate")}        // Must match the sortBy value ("orderDate") in backend controller
                    >Order Date</option>
                </select>

                <select name="sortOrder" id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border-2 rounded-xl px-2 py-1">
                    <option value="" onClick={() => setSortOrder("")}>Sort Order</option>
                    <option value="asc" onClick={() => setSortOrder("asc")}>Ascending</option>
                    <option value="desc" onClick={() => setSortOrder("desc")}>Descending</option>
                </select>
            </div>

            <div className="flex justify-between items-center mb-4">
                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                    {orderStatus.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setStatus(option.value.toLowerCase());
                            }}
                            className={`px-4 py-2 rounded-full font-semibold transition ${status === option.value
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                        >
                            {option.label}
                            <span className="ml-2 text-sm">
                                {option.value.toLowerCase() === "all"
                                    ? `(${orderAllCount})`
                                    : `(${orderStatusCount.find(s => s.status.toLowerCase() === option.value.toLowerCase())?.count || 0})`}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Clear Filters Button */}
                <a
                    onClick={() => {
                        setStatus("all");
                        setMinDate("");
                        setMaxDate("");
                        setSortBy("");
                        setSortOrder("");
                    }}
                    className="px-4 py-2 text-red-500 font-semibold hover:underline cursor-pointer transition"
                >
                    Clear Filters
                </a>
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
                            onCancelSuccess={(id) => setOrders(prev => prev.filter(o => o.id !== id))} />
                    ))}
                </div>
            )}

            <button
                className="ml-auto w-xs border rounded-lg cursor-pointer bg-green-500 hover:bg-green-700 font-bold text-white py-2 transition"
                onClick={handleExportCSV}
            >
                Export All Orders
            </button>
        </div>
    );
}

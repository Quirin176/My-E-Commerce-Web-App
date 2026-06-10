import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Package, Download } from "lucide-react";
import { adminOrdersApi } from "../../../api/admin/adminOrdersApi";
import UserOrderCard from "../../../components/orders/UserOrderCard";
import type { OrderResponse } from "../../../types/models/order/OrderResponse";
import { ORDER_STATUS_CONFIG, ORDER_ALL_STATUSES, type OrderStatus } from "../../../types/orderStatus";

interface OrderStatusCount {
    status: string;
    count: number;
}

// "all" sentinel + one entry per real status
const STATUS_FILTER_OPTIONS = [
    {
        value: "all" as const,
        label: "All",
        icon: Package,
        badgeColor: "bg-gray-100 text-gray-800",
        iconColor: "text-gray-500",
    },
    ...ORDER_ALL_STATUSES.map((status) => ({
        value: status,
        label: status,
        icon: ORDER_STATUS_CONFIG[status].icon,
        badgeColor: ORDER_STATUS_CONFIG[status].badgeColor,
        iconColor: ORDER_STATUS_CONFIG[status].iconColor,
    })),
];

export default function AdminOrders() {
    const [orderStatusCounts, setOrderStatusCounts] = useState<OrderStatusCount[]>([]);
    const [orderAllCount, setOrderAllCount] = useState(0);

    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [status, setStatus] = useState<"all" | OrderStatus>("all");
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    // Load stats once on mount
    useEffect(() => {
        const loadStats = async () => {
            try {
                const stats = await adminOrdersApi.getOrderStats();
                setOrderStatusCounts(stats.byStatus ?? []);
                setOrderAllCount(stats.totalOrders ?? 0);
            } catch {
                toast.error("Failed to load order statistics");
            }
        };
        loadStats();
    }, []);

    // Reload orders whenever any filter changes
    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            try {
                const response = await adminOrdersApi.getAllOrders(
                    status === "all" ? ("" as OrderStatus) : status,
                    minDate,
                    maxDate,
                    sortBy,
                    sortOrder,
                );
                setOrders(Array.isArray(response) ? response : []);
            } catch {
                toast.error("Failed to load orders");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, [status, minDate, maxDate, sortBy, sortOrder]);

    const handleOrderUpdate = async () => {
        // Refetch orders and stats after an update
        try {
            const response = await adminOrdersApi.getAllOrders(
                status === "all" ? ("" as OrderStatus) : status,
                minDate, maxDate, sortBy, sortOrder,
            );
            setOrders(Array.isArray(response) ? response : []);

            const stats = await adminOrdersApi.getOrderStats();
            setOrderStatusCounts(stats.byStatus ?? []);
            setOrderAllCount(stats.totalOrders ?? 0);
        } catch {
            toast.error("Failed to refresh orders");
        }
    };

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            const exportStatus = status === "all" ? ("" as OrderStatus) : status;
            const blob = await adminOrdersApi.exportOrders(exportStatus, minDate, maxDate, sortBy, sortOrder);

            const url = window.URL.createObjectURL(new Blob([blob], { type: "text/csv" }));
            const link = document.createElement("a");
            link.href = url;

            const dateStr = new Date().toISOString().slice(0, 10);
            link.setAttribute("download", `orders_${status}_${dateStr}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success(`Exported ${orders.length} order${orders.length !== 1 ? "s" : ""} to CSV`);
        } catch {
            toast.error("Failed to export orders");
        } finally {
            setExporting(false);
        }
    };

    const clearFilters = () => {
        setStatus("all");
        setMinDate("");
        setMaxDate("");
        setSortBy("");
        setSortOrder("");
    };

    const getStatusCount = (value: string) => {
        if (value === "all") return orderAllCount;
        return orderStatusCounts.find(
            (s) => s.status.toLowerCase() === value.toLowerCase()
        )?.count ?? 0;
    };

    return (
        <div className="flex flex-col gap-y-8 pt-8 px-8">

            {/* Export overlay */}
            {exporting && (
                <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent" />
                        <p className="font-semibold text-black">Exporting orders…</p>
                    </div>
                </div>
            )}

            {/* Date + Sort filters */}
            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                        <label className="font-bold whitespace-nowrap">Start Date</label>
                        <input
                            type="date"
                            value={minDate}
                            onChange={(e) => setMinDate(e.target.value)}
                            className="border-2 rounded-xl px-2 py-1"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="font-bold whitespace-nowrap">End Date</label>
                        <input
                            type="date"
                            value={maxDate}
                            onChange={(e) => setMaxDate(e.target.value)}
                            className="border-2 rounded-xl px-2 py-1"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border-2 rounded-xl px-2 py-1"
                    >
                        <option value="">Sort By</option>
                        <option value="customerName">Customer Name</option>
                        <option value="totalAmount">Total Amount</option>
                        <option value="orderDate">Order Date</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border-2 rounded-xl px-2 py-1"
                    >
                        <option value="">Order</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            {/* Status tabs + clear */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTER_OPTIONS.map(({ value, label, icon: Icon, badgeColor, iconColor }) => (
                        <button
                            key={value}
                            onClick={() => setStatus(value as typeof status)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${status === value
                                ? "bg-blue-600 text-white shadow-md"
                                : `${badgeColor} hover:opacity-80`
                                }`}
                        >
                            <Icon
                                size={16}
                                className={status === value ? "text-white" : iconColor}
                            />
                            <span>{label}</span>
                            <span className="text-sm">({getStatusCount(value)})</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={clearFilters}
                    className="text-red-500 font-semibold hover:underline transition text-sm"
                >
                    Clear Filters
                </button>
            </div>

            {/* Orders list */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                    <p className="text-gray-500 mt-4">Loading orders…</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">
                        {status === "all" ? "No orders found" : `No ${status} orders`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg border transition">
                            <UserOrderCard
                                {...order}
                                onCancelSuccess={(id) => setOrders((prev) => prev.filter((o) => o.id !== id))}
                                onUpdateSuccess={handleOrderUpdate}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Export button */}
            <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 ml-auto w-64 border rounded-lg cursor-pointer bg-green-500 hover:bg-green-600 font-bold text-white py-2 transition"
            >
                <Download size={18} />
                Export Orders to CSV
            </button>
        </div>
    );
}
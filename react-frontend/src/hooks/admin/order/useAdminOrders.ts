import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminOrdersApi } from "../../../api/admin/adminOrdersApi";
import type { OrderResponse } from "../../../types/models/order/OrderResponse";
import type { OrderStatus } from "../../../types/orderStatus";

interface OrderStatusCount {
    status: string;
    count: number;
}

export function useAdminOrders(pageSize: number) {

    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [allOrdersCount, setAllOrdersCount] = useState(0);
    const [orderStatusCounts, setOrderStatusCounts] = useState<OrderStatusCount[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [page, setPage] = useState<number>(1);
    const [status, setStatus] = useState<"all" | OrderStatus>("all");

    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");

    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const getApiStatus = useCallback(
        () => (status === "all" ? ("" as OrderStatus) : status),
        [status]
    );

    const loadStats = useCallback(async () => {
        try {
            const stats = await adminOrdersApi.getOrderStats();

            setOrderStatusCounts(stats.byStatus ?? []);
            setAllOrdersCount(stats.totalOrders ?? 0);
        } catch {
            toast.error("Failed to load order statistics");
        }
    }, []);

    const loadOrders = useCallback(async () => {
        setLoading(true);

        try {
            const response = await adminOrdersApi.getAllOrders(
                page,
                pageSize,
                getApiStatus(),
                minDate,
                maxDate,
                sortBy,
                sortOrder
            );

            setOrders(Array.isArray(response.data) ? response.data : []);
            setTotalCount(response.pagination.totalCount ?? 0);
        } catch {
            toast.error("Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [
        page,
        minDate,
        maxDate,
        sortBy,
        sortOrder,
        getApiStatus,
    ]);

    const refresh = useCallback(async () => {
        await Promise.all([
            loadOrders(),
            loadStats(),
        ]);
    }, [loadOrders, loadStats]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const changeStatus = (newStatus: "all" | OrderStatus) => {
        setPage(1);
        setStatus(newStatus);
    };

    const exportCsv = async () => {
        setExporting(true);
        try {
            const blob = await adminOrdersApi.exportOrders(getApiStatus(), minDate, maxDate, sortBy, sortOrder);

            const url = window.URL.createObjectURL(new Blob([blob], { type: "text/csv" }));

            const link = document.createElement("a");

            link.href = url;

            const dateStr = new Date().toISOString().slice(0, 10);

            link.download = `orders_${status}_${dateStr}.csv`;

            document.body.appendChild(link);
            link.click();
            link.remove();

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
        setPage(1);
    };

    const getStatusCount = (value: string) => {
        if (value === "all") return allOrdersCount;

        return orderStatusCounts.find(
            (s) => s.status.toLowerCase() === value.toLowerCase()
        )?.count ?? 0;
    };

    return {
        orders,
        totalCount,

        loading,
        exporting,

        page,
        setPage,

        status,
        setStatus: changeStatus,

        minDate,
        setMinDate,

        maxDate,
        setMaxDate,

        sortBy,
        setSortBy,

        sortOrder,
        setSortOrder,

        refresh,
        exportCsv,
        clearFilters,
        getStatusCount,
        setOrders,
    };
}
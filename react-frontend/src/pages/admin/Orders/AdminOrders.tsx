import { Package, Download } from "lucide-react";

import { useAdminOrders } from "../../../hooks/admin/order/useAdminOrders";
import { usePagination } from "../../../hooks/usePagination";

import StatusTabs from "../../../components/StatusTabs";
import AdminOrderCard from "../../../components/admin/orders/AdminOrderCard";
import AdminOrderFilters from "../../../components/admin/orders/AdminOrderFilters";
import PaginationControl from "../../../components/PaginationControl";

const PAGE_SIZE = 5;

export default function AdminOrders() {
    const {
        orders,
        totalCount,

        loading,
        exporting,

        page,
        setPage,

        status,
        setStatus,

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
    } = useAdminOrders(PAGE_SIZE);

    // ──────────────────── Pagination ────────────────────
    const { totalPages } = usePagination({
        totalCount,
        pageSize: PAGE_SIZE,
        currentPage: page,
        onPageChange: (p) => console.log({ page: p }),
    });

    return (
        <div className="flex flex-col gap-y-8 px-8 py-8 bg-(--bg-muted)">

            {/* Export overlay */}
            {exporting && (
                <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <div className="bg-white px-6 py-4 rounded-xl shadow-lg flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent" />
                        <p className="font-semibold text-black">Exporting orders…</p>
                    </div>
                </div>
            )}

            <AdminOrderFilters
                minDate={minDate}
                maxDate={maxDate}
                sortBy={sortBy}
                sortOrder={sortOrder}
                setMinDate={setMinDate}
                setMaxDate={setMaxDate}
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
                clearFilters={clearFilters}
            />

            {/* STATUS TABS PANEL */}
            <StatusTabs
                activeStatus={status}
                onStatusChange={setStatus}
                getCount={getStatusCount}
            />


            {/* Orders list */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                    <p className="text-gray-500 mt-4">Loading orders…</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-(--bg-surface) rounded-lg">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg">
                        {status === "all" ? "No orders found" : `No ${status} orders`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-(--bg-surface) rounded-lg border transition">
                            <AdminOrderCard
                                {...order}
                                onCancelSuccess={(id) => setOrders((prev) => prev.filter((o) => o.id !== id))}
                                onUpdateSuccess={refresh}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Export button */}
            <button
                onClick={exportCsv}
                className="flex items-center justify-center gap-2 ml-auto w-64 border rounded-lg cursor-pointer
                bg-green-500 hover:bg-green-600 font-bold text-white py-2 transition"
            >
                <Download size={18} />
                Export Orders to CSV
            </button>

            {/* Pagination Controls */}
            <div className="border rounded-2xl">
                <PaginationControl
                    currentPage={page}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    pageSize={PAGE_SIZE}
                    onPageChange={setPage}
                    showGoTo={false}
                />
            </div>

        </div>
    );
}
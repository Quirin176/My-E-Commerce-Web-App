import { useState } from "react";
import { X, Send, Loader } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../../hooks/auth/useAuth";
import { adminOrdersApi } from "../../../api/admin/adminOrdersApi";

import type { OrderResponse } from "../../../types/models/order/OrderResponse";
import { ORDER_STATUS_CONFIG, ORDER_ALL_STATUSES, type OrderStatus } from "../../../types/orderStatus";

interface UpdateOrderStatusFormProps {
    showForm: boolean;
    order: OrderResponse;
    setShowForm: (show: boolean) => void;
    onUpdateSuccess?: () => void;
}

export default function UpdateOrderStatusForm({
    showForm,
    order,
    setShowForm,
    onUpdateSuccess,
}: UpdateOrderStatusFormProps) {
    const { user } = useAuth();

    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status as OrderStatus);
    const [loading, setLoading] = useState(false);

    if (!showForm) return null;

    const handleSubmit = async () => {
        if (user === null) return;
        if (user.role !== "Admin") return;

        setLoading(true);
        try {
            await adminOrdersApi.updateOrderStatus(order.id, selectedStatus);
            toast.success(`Order status updated to ${selectedStatus}`, { duration: 4000 });
            onUpdateSuccess?.();
            setShowForm(false);
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) setShowForm(false);
    };

    const currentConfig = ORDER_STATUS_CONFIG[order.status as OrderStatus];
    const CurrentIcon = currentConfig.icon;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-(--bg-surface) rounded-2xl border-2 border-(--text-primary) shadow-2xl max-w-2xl w-full">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b rounded-t-lg">
                        <div>
                            <h2 className="text-2xl font-bold">Update Order Status</h2>
                            <p>Order #{order.id}</p>
                        </div>

                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="p-2 rounded-lg hover:bg-(--bg-muted) transition cursor-pointer disabled:opacity-50"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">

                        {/* Current status */}
                        <div className="flex items-center gap-4">
                            <p className="font-semibold mb-2">Current Status</p>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${currentConfig.badgeColor}`}>
                                <CurrentIcon size={16} className={currentConfig.iconColor} />
                                {order.status}
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
                                <p className="text-blue-600 font-bold mb-1">CUSTOMER</p>
                                <p className="font-bold text-blue-900">{order.customerName}</p>
                            </div>

                            <div className="bg-purple-100 p-4 rounded-lg border-2 border-purple-400">
                                <p className="text-purple-600 font-bold mb-1">ORDER DATE</p>
                                <p className="font-bold text-purple-900">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-400">
                                <p className="text-green-600 font-bold mb-1">TOTAL</p>
                                <p className="font-bold text-green-900">
                                    {order.totalAmount.toLocaleString()} VND
                                </p>
                            </div>

                        </div>

                        {/* Status selection */}
                        <div>
                            <p className="font-semibold mb-3">
                                Select New Status <span className="text-red-500">*</span>
                            </p>
                            <div className="space-y-2">
                                {ORDER_ALL_STATUSES.map((status) => {
                                    const config = ORDER_STATUS_CONFIG[status];
                                    const Icon = config.icon;
                                    const isSelected = selectedStatus === status;
                                    const isCurrent = status === order.status;

                                    return (
                                        <label
                                            key={status}
                                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition
                                                ${isSelected ? `${config.color} shadow-sm` : "border-gray-200 hover:bg-(--bg-muted)"}`}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={status}
                                                checked={isSelected}
                                                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                                                disabled={loading}
                                                className="w-4 h-4 cursor-pointer"
                                            />
                                            <Icon size={18} className={`ml-3 ${config.iconColor}`} />
                                            <span className="ml-2 font-medium">{status}</span>
                                            {isCurrent && (
                                                <span className="ml-auto text-xs bg-gray-400 text-white px-2 py-1 rounded">
                                                    Current
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 px-6 py-4 border-t rounded-b-lg">
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition cursor-pointer font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || selectedStatus === order.status}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer font-medium disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Updating…
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Update Status
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
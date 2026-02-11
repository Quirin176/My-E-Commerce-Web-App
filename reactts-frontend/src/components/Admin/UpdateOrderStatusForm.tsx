import { useState } from "react";
import { X, Send, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { adminOrdersApi } from "../../api/admin/adminOrdersApi";
import type { OrderResponseModel } from "../../types/models/order/OrderResponseModel";

interface UpdateOrderStatusFormProps {
    showForm: boolean;
    order: OrderResponseModel;
    setShowForm: (show: boolean) => void;
    onUpdateSuccess?: () => void;
}

export default function UpdateOrderStatusForm({
    showForm,
    order,
    setShowForm,
    onUpdateSuccess,
}: UpdateOrderStatusFormProps) {
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    // const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    if (!showForm) return null;

    const statuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case "pending":
                return "bg-yellow-50 border-yellow-300 text-yellow-900";
            case "confirmed":
                return "bg-blue-50 border-blue-300 text-blue-900";
            case "shipped":
                return "bg-purple-50 border-purple-300 text-purple-900";
            case "delivered":
                return "bg-green-50 border-green-300 text-green-900";
            case "cancelled":
                return "bg-red-50 border-red-300 text-red-900";
            default:
                return "bg-gray-50 border-gray-300 text-gray-900";
        }
    };

    const getStatusBadgeColor = (status: string) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // if (selectedStatus === order.status && !reason) {
        //     toast.error("Please change status or provide a reason");
        //     return;
        // }

        setLoading(true);
        try {
            await adminOrdersApi.updateOrderStatus(order.id, selectedStatus);
            
            toast.success(
                `Order status updated to ${selectedStatus}`,
                {
                    duration: 4000,
                }
            );
            
            onUpdateSuccess?.();
            setShowForm(false);
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={() => !loading && setShowForm(false)}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-2 border-b rounded-t-lg">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Update Order Status</h2>
                            <p className="text-sm text-gray-600 mt-1">Order ID: #{order.id}</p>
                        </div>
                        
                        <button
                            onClick={() => !loading && setShowForm(false)}
                            disabled={loading}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Current Status */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Status
                            </label>
                            <div className={`inline-block px-4 py-2 rounded-full border-2 font-semibold capitalize ${getStatusBadgeColor(order.status)}`}>
                                {order.status}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-600 font-semibold mb-1">CUSTOMER NAME</p>
                                <p className="text-sm font-bold text-blue-900">{order.customerName}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <p className="text-xs text-purple-600 font-semibold mb-1">ORDER DATE</p>
                                <p className="text-sm font-bold text-purple-900">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <p className="text-xs text-green-600 font-semibold mb-1">TOTAL AMOUNT</p>
                                <p className="text-sm font-bold text-green-900">
                                    {order.totalAmount.toLocaleString()} VND
                                </p>
                            </div>
                        </div>

                        {/* New Status Selection */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-3">
                                Select New Status <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                {statuses.map((status) => (
                                    <label
                                        key={status}
                                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                                            selectedStatus === status
                                                ? `${getStatusColor(status)} border-2 border-gray-400 shadow-md`
                                                : "bg-white border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="status"
                                            value={status}
                                            checked={selectedStatus === status}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            disabled={loading}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                        <span className="ml-3 font-medium">{status}</span>
                                        {status === order.status && (
                                            <span className="ml-auto text-xs bg-gray-400 text-white px-2 py-1 rounded">
                                                Current
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Reason/Notes */}
                        {/* <div>
                            <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                                Reason for Change (Optional)
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                disabled={loading}
                                placeholder="Add any notes or reason for this status change..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100 transition"
                                rows={4}
                            />
                            <p className="text-xs text-gray-500 mt-1">{reason.length}/500 characters</p>
                        </div> */}
                    </form>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
                        <button
                            onClick={() => !loading && setShowForm(false)}
                            disabled={loading}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Updating...
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

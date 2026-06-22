import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, X } from "lucide-react";
import { useAuth } from "../../hooks/auth/useAuth";
import type { OrderResponse } from "../../types/models/order/OrderResponse";
import { ORDER_STATUS, ORDER_STATUS_CONFIG, ORDER_TIMELINE_STATUSES } from "../../types/orderStatus";

interface UserOrderDetailModalProps {
    showForm: boolean;
    order: OrderResponse;
    setShowForm: (show: boolean) => void;
}

export default function UserOrderDetailModal({ showForm, order, setShowForm }: UserOrderDetailModalProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!showForm) return null;

    if (!user) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Please Login</h1>
                <button
                    onClick={() => navigate("/auth/login")}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    const isCancelled = order.status === ORDER_STATUS.Cancelled;
    const currentIndex = ORDER_TIMELINE_STATUSES.indexOf(order.status as any);
    const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG];

    const renderStatusTimeline = () => (
        <div className="w-full">
            <div className="flex items-center w-full">
                {ORDER_TIMELINE_STATUSES.map((s, index) => (
                    <React.Fragment key={s}>
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0
                                ${index <= currentIndex
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            {index + 1}
                        </div>
                        {index < ORDER_TIMELINE_STATUSES.length - 1 && (
                            <div
                                className={`flex-1 h-1 mx-2 ${index < currentIndex ? "bg-green-500" : "bg-gray-200"}`}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="flex justify-between mt-2">
                {ORDER_TIMELINE_STATUSES.map((s) => (
                    <span key={s} className="text-xs">{s}</span>
                ))}
            </div>
        </div>
    );

    return (
        <div
            className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
        >
            <div
                className="flex flex-col bg-(--bg-surface) rounded-lg shadow-2xl w-full max-w-7xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-(--bg-surface) sticky top-0 px-6 py-3 border-b z-10">
                    <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                    <button
                        onClick={() => setShowForm(false)}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded-xl transition"
                        aria-label="Close"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-6">

                    {/* Status + timeline */}
                    <div className="bg-(--bg-surface) border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-6">
                                <h3 className="text-lg font-bold">Order Status</h3>
                                <span className={`px-6 py-2 rounded-full border-2 font-bold capitalize ${statusConfig.badgeColor}`}>
                                    {order.status}
                                </span>
                            </div>

                            <button
                                onClick={() => navigate(`/order/${order.id}`)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition cursor-pointer"
                            >
                                <Download size={18} />
                                <span className="hidden sm:inline">Download / Print</span>
                            </button>
                        </div>

                        {isCancelled ? (
                            <div className="py-4 text-center text-red-600 font-semibold bg-red-50 rounded-lg border border-red-200">
                                This order has been cancelled.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold">Tracking Progress</h3>
                                {renderStatusTimeline()}
                            </div>
                        )}
                    </div>

                    {/* Shipping + Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-(--bg-surface) border rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-4">Shipping Information</h3>
                            <div className="space-y-1">
                                <p className="font-semibold">{order.customerName}</p>
                                <p>{order.shippingAddress}</p>
                                <p>📧 {order.customerEmail}</p>
                                <p>📱 {order.customerPhone}</p>
                            </div>
                        </div>

                        <div className="bg-(--bg-surface) border rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-4">Payment Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Payment Method:</span>
                                    <strong>{order.paymentMethod}</strong>
                                </div>
                                <div className="flex justify-between">
                                    <span>Order Date:</span>
                                    <strong>{new Date(order.orderDate).toLocaleDateString()}</strong>
                                </div>
                                <div className="flex justify-between pt-3 border-t">
                                    <span className="font-semibold">Total:</span>
                                    <strong className="text-blue-600 text-lg">
                                        {order.totalAmount.toLocaleString()} VND
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order items */}
                    {order.items && order.items.length > 0 && (
                        <div className="bg-(--bg-surface) border rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-4">Order Items</h3>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex justify-between items-center p-4 rounded border border-gray-200"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.productName}</p>
                                            <p className="text-sm">
                                                {item.quantity} × {item.unitPrice.toLocaleString()} VND
                                            </p>
                                        </div>
                                        <p className="font-bold">
                                            {item.totalPrice.toLocaleString()} VND
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t flex justify-end">
                                <div className="w-full md:w-64 space-y-2">

                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{order.totalAmount.toLocaleString()} VND</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span className="text-green-600 font-bold">Free</span>
                                    </div>

                                    <div className="flex justify-between text-lg font-bold p-3">
                                        <span>Total:</span>
                                        <span className="text-blue-600">{order.totalAmount.toLocaleString()} VND</span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {order.notes && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-bold text-blue-800 mb-2">Order Notes</h4>
                            <p className="text-blue-700">{order.notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowForm(false)}
                            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
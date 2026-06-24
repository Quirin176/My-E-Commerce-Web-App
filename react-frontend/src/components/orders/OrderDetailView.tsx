import React from "react";
import type { OrderResponse } from "../../types/models/order/OrderResponse";
import { ORDER_STATUS, ORDER_STATUS_CONFIG, ORDER_TIMELINE_STATUSES, type OrderStatus } from "../../types/orderStatus";

interface OrderDetailViewProps {
    order: OrderResponse;
}

export default function OrderDetailView({
    order,
}: OrderDetailViewProps) {
    const isCancelled = order.status === ORDER_STATUS.Cancelled;
    const currentIndex = ORDER_TIMELINE_STATUSES.indexOf(order.status as OrderStatus);
    const statusConfig = ORDER_STATUS_CONFIG[order.status as OrderStatus];
    const StatusIcon = statusConfig.icon;

    return (
        <div id="print-area" className="space-y-6">

            {/* STATUS CARD */}
            <div className="p-6 rounded-lg border-2 border-(--border)">
                <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-bold">Order Status</h3>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${statusConfig.badgeColor}`}>
                        <StatusIcon size={18} className={statusConfig.iconColor} />
                        {order.status}
                    </div>
                </div>

                {isCancelled ? (
                    <div className="py-4 text-center text-red-600 font-semibold bg-red-50 rounded-lg border border-red-200">
                        This order has been cancelled.
                    </div>
                ) : (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Tracking Progress</h4>

                        {/* Step dots + connectors */}
                        <div className="flex items-center">
                            {ORDER_TIMELINE_STATUSES.map((s, index) => (
                                <React.Fragment key={s}>
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0
                                            ${index <= currentIndex ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                                    >
                                        {index + 1}
                                    </div>

                                    {index < ORDER_TIMELINE_STATUSES.length - 1 && (
                                        <div className={`flex-1 h-1 mx-2 ${index < currentIndex ? "bg-green-500" : "bg-gray-200"}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Step labels */}
                        <div className="flex justify-between text-xs">
                            {ORDER_TIMELINE_STATUSES.map((status) => (
                                <span key={status}>{status}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Shipping + Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg border-2 border-(--border)">
                    <h3 className="font-bold text-lg mb-4">Shipping Information</h3>
                    <div className="space-y-1">
                        <p className="font-semibold">{order.customerName}</p>
                        <p>{order.shippingAddress}</p>
                        <p>📧 {order.customerEmail}</p>
                        <p>📱 {order.customerPhone}</p>
                    </div>
                </div>

                <div className="p-6 rounded-lg border-2 border-(--border)">
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
                            <strong className="text-blue-600 text-lg">{order.totalAmount.toLocaleString()} VND</strong>
                        </div>

                    </div>
                </div>
            </div>

            {/* Order items */}
            {order.items && order.items.length > 0 && (
                <div className="p-6 rounded-lg border-2 border-(--border)">
                    <h3 className="font-bold text-lg mb-4">Order Items</h3>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div
                                key={item.productId}
                                className="flex justify-between items-center p-4 rounded border border-(--border)"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold">{item.productName}</p>
                                    <p className="text-sm">{item.quantity} × {item.unitPrice.toLocaleString()} VND</p>
                                </div>

                                <p className="font-bold">{item.totalPrice.toLocaleString()} VND</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t-2 flex justify-end">
                        <div className="w-full md:w-64 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{order.totalAmount.toLocaleString()} VND</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span className="text-green-600 font-semibold">Free</span>
                            </div>

                            <div className="flex justify-between text-lg font-bold p-3 bg-blue-50 rounded">
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
        </div>
    );
}
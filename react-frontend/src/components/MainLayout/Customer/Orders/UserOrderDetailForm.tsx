import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, X } from "lucide-react";
import { useAuth } from "../../../../hooks/users/useAuth";
import type { OrderResponseModel } from "../../../../types/models/order/OrderResponseModel";

interface UserOrderDetailFormProps {
    showForm: boolean;
    order: OrderResponseModel;
    setShowForm: (show: boolean) => void;
}

export default function UserOrderDetailForm({ showForm, order, setShowForm }: UserOrderDetailFormProps) {
    if (!showForm) return null;

    const navigate = useNavigate();
    const { user } = useAuth();

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "confirmed":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "shipped":
                return "bg-purple-100 text-purple-800 border-purple-300";
            case "delivered":
                return "bg-green-100 text-green-800 border-green-300";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getStatusTimeline = (status: string) => {
        const statuses = ["pending", "confirmed", "shipped", "delivered"];
        const currentIndex = statuses.indexOf(status.toLowerCase());

        return (
            <div className="w-full">
                <div className="flex items-center w-full">
                    {statuses.map((s, index) => (
                        <React.Fragment key={s}>
                            {/* Circle */}
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold 
                        ${index <= currentIndex ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                            >
                                {index + 1}
                            </div>

                            {/* Line */}
                            {index < statuses.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-2
                                ${index < currentIndex ? "bg-green-500" : "bg-gray-300"}`}
                                ></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );

    };

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

    // if (loading) {
    //     return (
    //         <div className="container mx-auto p-6 text-center">
    //             <div className="inline-block">
    //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    //             </div>
    //             <p className="text-gray-500 mt-4">Loading order details...</p>
    //         </div>
    //     );
    // }

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4"
                onClick={() => setShowForm(false)}
            >
                <div
                    className="flex flex-col bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between bg-white sticky top-0 px-6 py-2 border-b z-10">
                        <h1 className="text-2xl font-bold text-black">Order #{order.id}</h1>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-black hover:bg-gray-300 transition rounded-xl cursor-pointer p-1"
                            aria-label="Close"
                        >
                            <X size={32} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col gap-y-4 overflow-y-auto">
                        {/* Status */}
                        <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center mb-6 gap-10">
                                    <h3 className="text-lg font-bold text-gray-800">Order Status</h3>

                                    <p className={`inline-block px-6 py-3 rounded-full border-2 font-bold capitalize ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate(`/order/${order.id}`)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                                >
                                    <Download size={20} />
                                    <span className="hidden sm:inline">Download/Print</span>
                                </button>
                            </div>

                            {/* Timeline */}
                            <div className="flex flex-col gap-y-4">
                                <h4 className="text-lg font-semibold text-black">Tracking Progress</h4>
                                <div className="flex justify-between">
                                    {getStatusTimeline(order.status)}
                                </div>
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Pending</span>
                                    <span>Confirmed</span>
                                    <span>Shipped</span>
                                    <span>Delivered</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Information */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="font-bold text-lg text-gray-800 mb-4">Shipping Information</h3>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>{order.customerName}</strong></p>
                                    <p>{order.shippingAddress}</p>
                                    <p>📧 {order.customerEmail}</p>
                                    <p>📱 {order.customerPhone}</p>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="font-bold text-lg text-gray-800 mb-4">Payment Details</h3>
                                <div className="space-y-3 text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Payment Method:</span>
                                        <strong>{order.paymentMethod}</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Order Date:</span>
                                        <strong>{new Date(order.orderDate).toLocaleDateString()}</strong>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t">
                                        <span className="font-semibold">Total Amount:</span>
                                        <strong className="text-blue-600 text-lg">{order.totalAmount.toLocaleString()} VND</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="font-bold text-lg text-gray-800 mb-4">Order Items</h3>
                                <div className="space-y-3">
                                    {order.items.map(item => (
                                        <div key={item.productId} className="flex justify-between items-center p-4 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity} × {item.unitPrice.toLocaleString()} VND</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">{item.totalPrice.toLocaleString()} VND</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total */}
                                <div className="mt-4 pt-4 border-t-2">
                                    <div className="flex justify-end">
                                        <div className="w-full md:w-64">
                                            <div className="flex justify-between text-gray-600 mb-2">
                                                <span>Subtotal:</span>
                                                <span>{order.totalAmount.toLocaleString()} VND</span>
                                            </div>
                                            <div className="flex justify-between text-gray-600 mb-4">
                                                <span>Shipping:</span>
                                                <span className="text-green-600 font-semibold">Free</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold text-gray-800 p-3 bg-blue-50 rounded">
                                                <span>Total:</span>
                                                <span className="text-blue-600">{order.totalAmount.toLocaleString()} VND</span>
                                            </div>
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
                        <div className="flex items-center justify-end p-2 print:hidden">
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
        </>
    );
}

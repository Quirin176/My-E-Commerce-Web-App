import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { Clock, CheckCircle, ChevronDown, Eye, Truck, Package } from "lucide-react";
import { adminOrdersApi } from "../../api/admin/adminOrdersApi";
import type { OrderResponseModel } from "../../types/models/order/OrderResponseModel";
import UseOrderDetailForm from "./UserOrderDetailForm";
import UpdateOrderStatusForm from "../Admin/UpdateOrderStatusForm";

// Extend Model
interface UserOrderCardProps extends OrderResponseModel {
  onDeleteSuccess?: (id: number | string) => void;
}

export default function UserOrderCard(order: UserOrderCardProps) {
    const [open, setOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const { user } = useAuth();

    const getStatusIcon = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case "pending":
                return <Clock size={20} className="text-yellow-500" />;
            case "confirmed":
                return <CheckCircle size={20} className="text-blue-500" />;
            case "shipped":
                return <Truck size={20} className="text-purple-500" />;
            case "delivered":
                return <CheckCircle size={20} className="text-green-500" />;
            case "cancelled":
                return <Package size={20} className="text-red-500" />;
            default:
                return <Package size={20} className="text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
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

    const handleTrackShipment = () => {
        if (order.status.toLowerCase() === "shipped") {
            toast.loading("Tracking Feature Available Later")
        };
    };

    const handleCancelOrder = async () => {
        try {
            await adminOrdersApi.deleteOrder(order.id);

            toast.success("Successfully Cancel Order");

            order.onDeleteSuccess?.(order.id);

        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        }
    };

    return (
        <>
            <div key={order.id} className="bg-white rounded-lg shadow-lg hover:shadow-lg transition">
                {/* Order Header - Always Visible */}
                <div
                    className="px-6 py-2 cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => setOpen(!open)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                        {/* Order Number */}
                        <div>
                            <p className="text-sm text-gray-600">Order ID</p>
                            <p className="text-lg font-bold text-gray-800">#{order.id}</p>
                        </div>

                        {/* Order Date */}
                        <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="text-lg font-bold text-gray-800">{new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>

                        {/* Customer */}
                        <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="text-lg font-bold text-gray-800">{order.customerName}</p>
                        </div>

                        {/* Status */}
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Status</p>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="font-semibold text-base capitalize">
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Items Count */}
                        <div>
                            <p className="text-sm text-gray-600">Items</p>
                            <p className="text-lg font-bold text-gray-800">
                                {order.itemCount}
                            </p>
                        </div>

                        {/* Total Amount */}
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-lg font-bold text-blue-600">
                                {order.totalAmount.toLocaleString()} VND
                            </p>
                        </div>

                        {/* Expand Arrow */}
                        <div className="flex justify-end md:justify-center">
                            <ChevronDown
                                size={24}
                                className={`text-gray-600 transition ${open ? "rotate-180" : ""}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Order Details - Expandable */}
                {open && (
                    <div className="border-t p-6 bg-gray-50">
                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h4 className="font-bold text-gray-800 mb-3">Shipping Information</h4>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <div className="flex flex-row gap-20">
                                        <p><strong>Email:</strong> {order.customerEmail}</p>
                                        <p><strong>Phone:</strong> {order.customerPhone}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800 mb-3">Payment Information</h4>
                                <div className="flex flex-row gap-20 text-sm text-gray-700">
                                    <p><strong>Method:</strong> <span className="capitalize">{order.paymentMethod}</span></p>
                                    <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items - Only show if we have item details */}
                        {order.items && order.items.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-800 mb-3">Order Items</h4>
                                <div className="space-y-2 bg-white rounded p-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 justify-between items-center text-sm pb-2 border-b last:border-b-0">
                                            <p className="font-semibold text-gray-800">{item.productName}</p>
                                            <p className="font-semibold text-gray-800 text-right">{item.unitPrice.toLocaleString()} VND</p>
                                            <p className="font-semibold text-gray-800 text-right">Quantity: {item.quantity}</p>
                                            <p className="font-semibold text-gray-800 text-right">{item.totalPrice.toLocaleString()} VND</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                            >
                                <Eye size={18} />
                                View Details
                            </button>

                            {order.status.toLowerCase() === "shipped" && (
                                <button
                                    onClick={() => handleTrackShipment()}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
                                >
                                    <Truck size={18} />
                                    Track Shipment
                                </button>
                            )}

                            {user?.role === "Admin" && (
                                <>
                                    <button
                                        onClick={() => setShowUpdateForm(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
                                    >
                                        Update Status
                                    </button>

                                    <button
                                        onClick={() => handleCancelOrder()}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                                    >
                                        Cancel Order
                                    </button>

                                </>

                            )}

                            {user?.role === "Customer" && order.status.toLowerCase() === "pending" && (
                                <button
                                    onClick={() => handleCancelOrder()}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {showForm && (
                <UseOrderDetailForm
                    showForm={showForm}
                    order={order}
                    setShowForm={setShowForm}
                />
            )}

            {showUpdateForm && (
                <UpdateOrderStatusForm
                    showForm={showUpdateForm}
                    order={order}
                    setShowForm={setShowUpdateForm}
                    onUpdateSuccess={() => { window.location.reload(); }}
                />
            )}
        </>
    )
}
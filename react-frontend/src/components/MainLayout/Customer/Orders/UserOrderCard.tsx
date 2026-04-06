import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../../hooks/users/useAuth";
import { Clock, CheckCircle, Eye, SquarePen, Truck, Package, X } from "lucide-react";
import { adminOrdersApi } from "../../../../api/admin/adminOrdersApi";
import type { OrderResponseModel } from "../../../../types/models/order/OrderResponseModel";
import UseOrderDetailForm from "./UserOrderDetailForm";
import UpdateOrderStatusForm from "../../../Admin/Orders/UpdateOrderStatusForm";

// Extend Model
interface UserOrderCardProps extends OrderResponseModel {
    onCancelSuccess?: (id: number | string) => void;
}

export default function UserOrderCard(order: UserOrderCardProps) {
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
            await adminOrdersApi.updateOrderStatus(order.id, "cancelled");

            toast.success("Successfully Cancel Order");

            order.onCancelSuccess?.(order.id);

        } catch (error) {
            toast.error("Failed to update order status");
        }
    };

    return (
        <>
            <div key={order.id} className="bg-white rounded-lg shadow-lg hover:shadow-lg transition">

                {/* Order Header */}
                <div
                    className="px-6 py-3 cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => setShowForm(true)}
                >
                    <div className="flex justify-between items-center gap-6">

                        {/* LEFT: ORDER DATA */}
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">

                            {/* Order ID */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600">Order ID</p>
                                <p className="text-lg font-bold text-gray-800">#{order.id}</p>
                            </div>

                            {/* Date */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Customer */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600">Customer</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {order.customerName}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="font-semibold text-base capitalize">
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600">Items</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {order.itemCount}
                                </p>
                            </div>

                            {/* Total */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-lg font-bold text-blue-600">
                                    {order.totalAmount.toLocaleString()} VND
                                </p>
                            </div>

                        </div>

                        {/* RIGHT: ACTION BUTTONS */}
                        <div className="flex items-center gap-2 justify-end min-w-36">

                            <button
                                onClick={(e) => { e.stopPropagation(); setShowForm(true); }}
                                title="View Order Detail"
                                className="flex items-center gap-2 px-3 py-2 bg-white text-blue-600 rounded hover:text-white hover:bg-blue-600 border-2 transition"
                            >
                                <Eye size={18} />
                            </button>

                            {user?.role === "Admin" && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowUpdateForm(true); }}
                                    title="Update Order"
                                    className="flex items-center gap-2 px-3 py-2 bg-white text-green-600 rounded hover:text-white hover:bg-green-600 border-2 transition"
                                >
                                    <SquarePen size={18} />
                                </button>
                            )}

                            {order.status.toLowerCase() === "shipped" && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleTrackShipment(); }}
                                    title="Track Shipment"
                                    className="flex items-center gap-2 px-3 py-2 bg-white text-purple-600 rounded hover:text-white hover:bg-purple-600 border-2 transition"
                                >
                                    <Truck size={18} />
                                </button>
                            )}

                            {order.status.toLowerCase() === "pending" && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleCancelOrder(); }}
                                    title="Cancel Order"
                                    className="flex items-center gap-2 px-3 py-2 bg-white text-red-600 rounded hover:text-white hover:bg-red-600 border-2 transition"
                                >
                                    <X size={18} />
                                </button>
                            )}

                        </div>
                    </div>
                </div>
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
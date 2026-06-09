import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/auth/useAuth";
import { Download, SquarePen, Truck, X } from "lucide-react";
import { adminOrdersApi } from "../../api/admin/adminOrdersApi";
import type { OrderResponse } from "../../types/models/order/OrderResponse";
import UserOrderDetailModal from "./UserOrderDetailModal";
import UpdateOrderStatusForm from "../admin/orders/UpdateOrderStatusForm";
import { ORDER_STATUS, ORDER_STATUS_CONFIG } from "../../types/orderStatus";

// Extend Model
interface UserOrderCardProps extends OrderResponse {
    onCancelSuccess?: (id: number | string) => void;
}

export default function UserOrderCard(order: UserOrderCardProps) {
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const { user } = useAuth();

    const navigate = useNavigate();

    const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG];

    const StatusIcon = statusConfig.icon;

    const handleViewDetail = () => {
        navigate(`/order/${order.id}`);
    }

    const handleTrackShipment = () => {
        if (order.status === ORDER_STATUS.Shipped) {
            toast.loading("Tracking Feature Available Later")
        };
    };

    const handleCancelOrder = async () => {
        try {
            await adminOrdersApi.updateOrderStatus(order.id, ORDER_STATUS.Cancelled);

            toast.success("Successfully Cancel Order");

            order.onCancelSuccess?.(order.id);

        } catch (error) {
            toast.error("Failed to update order status");
        }
    };

    return (
        <>
            <div key={order.id}>

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
                                <p className="text-lg font-bold">#{order.id}</p>
                            </div>

                            {/* Date */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="text-lg font-bold">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Customer */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600">Customer</p>
                                <p className="text-lg font-bold">
                                    {order.customerName}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${statusConfig.badgeColor}`}>
                                    <StatusIcon
                                        size={20}
                                        className={statusConfig.iconColor}
                                    />
                                    <span className="font-semibold text-base">
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600">Items</p>
                                <p className="text-lg font-bold">
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
                                onClick={() => handleViewDetail()}
                                title="Download Order Detail"
                                className="flex items-center gap-2 px-3 py-2 bg-white text-blue-600 rounded hover:text-white hover:bg-blue-600 border-2 transition"
                            >
                                <Download size={18} />
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

                            {order.status === ORDER_STATUS.Shipped && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleTrackShipment(); }}
                                    title="Track Shipment"
                                    className="flex items-center gap-2 px-3 py-2 bg-white text-purple-600 rounded hover:text-white hover:bg-purple-600 border-2 transition"
                                >
                                    <Truck size={18} />
                                </button>
                            )}

                            {order.status === ORDER_STATUS.Pending && (
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
                <UserOrderDetailModal
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
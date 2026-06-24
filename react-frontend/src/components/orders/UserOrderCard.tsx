import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/auth/useAuth";
import { Eye, Truck, X } from "lucide-react";
import { orderApi } from "../../api/user/orderApi";
import type { OrderResponse } from "../../types/models/order/OrderResponse";
import UserOrderDetailModal from "./UserOrderDetailModal";
import { ORDER_STATUS, ORDER_STATUS_CONFIG } from "../../types/orderStatus";

interface UserOrderCardProps extends OrderResponse {
    onCancelSuccess?: (id: number | string) => void;
    onUpdateSuccess?: (id: number | string) => void;
}

export default function UserOrderCard(order: UserOrderCardProps) {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG];
    const StatusIcon = statusConfig.icon;

    const handleViewDetail = () => {
        if (!user) return;

        if (user.username !== order.customerName) return;
        else navigate(`/order/${order.id}`);
    }

    const handleTrackShipment = () => {
        if (order.status === ORDER_STATUS.Shipped) {
            toast.loading("Tracking feature coming soon", { duration: 2000 });
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            // Customers cancel via their own orderApi endpoint
            await orderApi.updateStatus(order.id, ORDER_STATUS.Cancelled);
            toast.success("Order cancelled successfully");
            order.onCancelSuccess?.(order.id);
        } catch {
            toast.error("Failed to cancel order");
        }
    };

    return (
        <>
            <div>
                {/* Order Row */}
                <div
                    className="px-6 py-3 cursor-pointer transition"
                    onClick={() => setShowDetailModal(true)}
                >
                    <div className="flex justify-between items-center gap-6">

                        {/* Order data columns */}
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">
                            <div className="flex flex-col items-center">
                                <p className="text-sm">Order ID</p>
                                <p className="text-lg font-bold">#{order.id}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-sm">Date</p>
                                <p className="text-lg font-bold">
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-sm">Customer</p>
                                <p className="text-lg font-bold">{order.customerName}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-sm mb-1">Status</p>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${statusConfig.badgeColor}`}>
                                    <StatusIcon size={16} className={statusConfig.iconColor} />
                                    <span className="font-semibold text-sm">{order.status}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-sm">Items</p>
                                <p className="text-lg font-bold">{order.itemCount}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-sm">Total</p>
                                <p className="text-lg font-bold text-(--price)">
                                    {order.totalAmount.toLocaleString()} VND
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-4 justify-end min-w-36" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={handleViewDetail}
                                title="View order detail"
                                className="flex items-center gap-2 px-3 py-2 text-blue-600 rounded hover:text-white hover:bg-blue-600 border-2 transition cursor-pointer"
                            >
                                <Eye size={18} />
                            </button>

                            {order.status === ORDER_STATUS.Shipped && (
                                <button
                                    onClick={handleTrackShipment}
                                    title="Track shipment"
                                    className="flex items-center gap-2 px-3 py-2 text-purple-600 rounded hover:text-white hover:bg-purple-600 border-2 transition cursor-pointer"
                                >
                                    <Truck size={18} />
                                </button>
                            )}

                            {order.status === ORDER_STATUS.Pending && (
                                <button
                                    onClick={handleCancelOrder}
                                    title="Cancel order"
                                    className="flex items-center gap-2 px-3 py-2 text-red-600 rounded hover:text-white hover:bg-red-600 border-2 transition cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showDetailModal && (
                <UserOrderDetailModal
                    showForm={showDetailModal}
                    order={order}
                    setShowForm={setShowDetailModal}
                />
            )}

        </>
    );
}
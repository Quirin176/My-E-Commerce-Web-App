import { Link, useNavigate } from "react-router-dom";
import { Download, X } from "lucide-react";
import { useAuth } from "../../hooks/auth/useAuth";
import type { OrderResponse } from "../../types/models/order/OrderResponse";

import OrderDetailView from "./OrderDetailView";

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
                    onClick={() => navigate("/auth?mode=login")}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
        >
            <div
                className="flex flex-col bg-(--bg-surface) w-full max-w-7xl max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-(--bg-surface) sticky top-0 pl-8 py-3 border-b z-10">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Order #{order.id}
                        </h1>
                        <p className="text-sm mt-1">
                            View details, print, or download this order
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        {user.role === "Customer" && (
                            <Link
                                to={`/order/${order.id}`}
                                className="flex items-center w-fit gap-2 px-4 py-2 my-2
                                bg-gray-600 text-white rounded hover:bg-(--bg-muted) transition cursor-pointer"
                            >
                                <Download size={18} />
                                <span className="hidden sm:inline">Download / Print</span>
                            </Link>
                        )}

                        <button
                            onClick={() => setShowForm(false)}
                            className="w-10 h-10 p-1 hover:bg-(--bg-muted) rounded-xl transition cursor-pointer"
                            aria-label="Close"
                        >
                            <X size={28} />
                        </button>
                    </div>

                </div>

                <div className="overflow-y-auto">
                    <div className="p-8">
                        <OrderDetailView
                            order={order}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end pr-8 pb-8">
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
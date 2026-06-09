import {
    Clock,
    CheckCircle,
    Truck,
    Package
} from "lucide-react";

export const ORDER_STATUS = {
    Pending: "Pending",
    Processing: "Processing",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
} as const;

export type OrderStatus =
    typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_CONFIG = {
    Pending: {
        color: "bg-yellow-50 border-yellow-300 text-yellow-900",
        badgeColor: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        iconColor: "text-yellow-500",
    },
    Processing: {
        color: "bg-indigo-50 border-indigo-300 text-indigo-900",
        badgeColor: "bg-indigo-100 text-indigo-800",
        icon: Package,
        iconColor: "text-indigo-500",
    },
    Shipped: {
        color: "bg-purple-50 border-purple-300 text-purple-900",
        badgeColor: "bg-purple-100 text-purple-800",
        icon: Truck,
        iconColor: "text-purple-500",
    },
    Delivered: {
        color: "bg-green-50 border-green-300 text-green-900",
        badgeColor: "bg-green-100 text-green-800",
        icon: CheckCircle,
        iconColor: "text-green-500",
    },
    Cancelled: {
        color: "bg-red-50 border-red-300 text-red-900",
        badgeColor: "bg-red-100 text-red-800",
        icon: Package,
        iconColor: "text-red-500",
    },
} satisfies Record<OrderStatus, {
    color: string;
    badgeColor: string;
    icon: React.ElementType;
    iconColor: string;
}>;

export const ORDER_PROGRESS_STATUSES = [
    ORDER_STATUS.Pending,
    ORDER_STATUS.Processing,
    ORDER_STATUS.Shipped,
    ORDER_STATUS.Delivered,
    ORDER_STATUS.Cancelled,
];
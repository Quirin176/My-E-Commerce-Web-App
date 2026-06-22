import { Package } from "lucide-react";
import {
    ORDER_ALL_STATUSES,
    ORDER_STATUS_CONFIG,
    type OrderStatus,
} from "../types/orderStatus";

export type StatusFilterValue = "all" | OrderStatus;

interface StatusTabsProps {
    activeStatus: StatusFilterValue;
    onStatusChange: (status: StatusFilterValue) => void;
    getCount: (status: StatusFilterValue) => number;
}

const STATUS_OPTIONS = [
    {
        value: "all" as const,
        label: "All",
        icon: Package,
        badgeColor: "bg-gray-100 text-gray-800",
        iconColor: "text-gray-500",
    },
    ...ORDER_ALL_STATUSES.map((status) => ({
        value: status,
        label: status,
        icon: ORDER_STATUS_CONFIG[status].icon,
        badgeColor: ORDER_STATUS_CONFIG[status].badgeColor,
        iconColor: ORDER_STATUS_CONFIG[status].iconColor,
    })),
];

export default function StatusTabs({
    activeStatus,
    onStatusChange,
    getCount,
}: StatusTabsProps) {
    return (
        <div className="flex flex-wrap gap-4">
            {STATUS_OPTIONS.map(
                ({ value, label, icon: Icon, badgeColor, iconColor }) => (
                    <button
                        key={value}
                        onClick={() => onStatusChange(value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition cursor-pointer
                            ${activeStatus === value ? `${badgeColor} border-2 border-${badgeColor}` : `${badgeColor} hover:opacity-80`}`}
                    >
                        <Icon
                            size={16}
                            className={iconColor}
                        />

                        <span>{label}</span>

                        <span className="text-sm">
                            ({getCount(value)})
                        </span>
                    </button>
                )
            )}
        </div>
    );
}
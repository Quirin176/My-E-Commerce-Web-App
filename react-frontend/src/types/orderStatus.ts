export const ORDER_STATUS = {
    Pending: "Pending",
    Confirmed: "Confirmed",
    Processing: "Processing",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled"
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
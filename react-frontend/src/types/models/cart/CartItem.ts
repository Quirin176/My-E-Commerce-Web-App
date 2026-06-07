export interface CartItem {
    cartId: string;           // Unique key: "{productId}-{variantId}" or "{productId}-base"
    id: number | string;      // Product ID (kept for order creation)
    variantId?: number;       // Variant ID (kept for display / order creation)
    name: string;
    slug: string;
    price: number;
    image: string;
    quantity: number;   // Quantity of the Item in Order
    option?: { optionName: string; value: string }[];
}
export interface CartItem {
    id: number | string;
    name: string;
    slug: string;
    price: number;
    image: string;
    quantity: number;   // Quantity of the Item in Order
}
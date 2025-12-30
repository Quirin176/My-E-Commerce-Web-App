export interface CartItem {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string;
    quantity: number;
    option?: Array<{
        optionName: string;
        value: string;
    }>;
}

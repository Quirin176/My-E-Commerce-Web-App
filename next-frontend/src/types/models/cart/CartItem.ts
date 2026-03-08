export interface CartItem {
    id: number | string;
    name: string;
    slug: string;
    price: number;
    image: string;
    option?: Array<{
        optionName: string;
        value: string;
    }>;
    quantity: number;
}

import type { ProductOption } from "./ProductOption";

export interface DynamicFiltersProps {
    categories: ProductOption[] | null | undefined;
    selectedOptions: (string | number)[];
    setSelectedOptions: (option: (string | number)[]) => void;
    minPrice: string | number;
    setMinPrice: (price: string | number) => void;
    maxPrice: string | number;
    setMaxPrice: (price: string | number) => void;
    priceOrder: string;
    setPriceOrder: (order: string) => void;
}
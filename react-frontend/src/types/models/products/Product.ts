import type { Category } from "./Category";
import type { ProductOption, ProductOptionFlat } from "./ProductOption";

export interface Product {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  images: string[];
  categoryId?: number | string;
  category?: Category;
  options?: ProductOption[] | ProductOptionFlat[];
  selectedOptionValueIds?: number[];
}

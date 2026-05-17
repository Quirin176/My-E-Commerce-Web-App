import type { Category } from "./Category";
import type { ProductOption } from "./ProductOption";

export interface Product {
  id: number | string;
  name: string;
  slug: string;
  basePrice: number;
  description?: string;
  shortDescription?: string;
  thumbnailUrl: string;
  categoryId?: number | string;
  category?: Category;
  options?: ProductOption[];
  selectedOptionValueIds?: number[];
}

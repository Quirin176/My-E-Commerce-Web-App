import type { Category } from "./Category";
import type { ProductOption } from "./ProductOption";
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
  options?: Array<ProductOption>;
  selectedOptionValueIds?: Array<number>;
}

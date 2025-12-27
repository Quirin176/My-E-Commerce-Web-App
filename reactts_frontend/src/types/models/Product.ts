import type { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  imageUrl?: string;
  image?: string;
  categoryId?: number;
  category: Category;
  options?: Array<{
    optionName: string;
    value: string;
  }>;
}
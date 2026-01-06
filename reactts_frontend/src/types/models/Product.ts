import type { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  images: string[];
  categoryId?: number;
  category?: Category;
  options?: Array<{
    optionName: string;
    value: string;
  }>;
  selectedOptionValueIds?: Array<number>;
}

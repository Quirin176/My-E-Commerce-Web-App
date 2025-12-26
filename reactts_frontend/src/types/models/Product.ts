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
  options?: Array<{
    optionName: string;
    value: string;
  }>;
}
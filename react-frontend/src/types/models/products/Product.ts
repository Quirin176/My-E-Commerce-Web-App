import type { Category } from "./Category";

export interface ImagePayload {
    id: number,
    imageUrl: string,
    displayOrder: number,
    isMain: boolean,
    productId: number | null,
    variantId: number | null,
}

export interface ProductVariant {
  id: number;
  variantName: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  // productId: number;
  images: ImagePayload[];
}

interface ProductOptionValue {
  optionValueId: number;
  value: string;
}

export interface ProductOptionPayload {
  id: number;
  optionName: string;
  optionValues: ProductOptionValue[];
}

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
  options?: ProductOptionPayload[];
  selectedOptionValueIds?: number[];
  stock: number;
  hasVariants: boolean;
  variants: ProductVariant[];
}

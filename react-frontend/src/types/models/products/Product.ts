import type { Category } from "./Category";

export interface ImagePayload {
  id: number,
  imageUrl: string,
  displayOrder: number,
  isMain: boolean,
  productId: number | null,
  variantId: number | null,
}

export interface ProductVariantOptionValue {
  optionValueId: number;
  optionName: string;
  value: string;
}

export interface ProductVariant {
  id: number;
  variantName: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  productId: number;
  images: ImagePayload[];
  optionValues: ProductVariantOptionValue[];
}

export interface ProductOptionValue {
  optionValueId: number;
  value: string;
}

export interface ProductOption {
  optionId: number;
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
  options?: ProductOption[];
  selectedOptionValueIds?: number[];
  stock: number;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

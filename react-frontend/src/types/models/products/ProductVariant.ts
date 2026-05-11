export interface ProductVariant {
  id: number;
  variantName: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  imageUrl?: string;
  productId: number | string;
  optionValueIds: number[];
}

export interface ProductVariantForm {
  id?: number;
  variantName: string;
  sku: string;
  price: number | string;
  originalPrice: number | string;
  stock: number | string;
  imageUrl: string;
  optionValueIds: number[];
}

export const EMPTY_VARIANT_FORM: ProductVariantForm = {
  variantName: "",
  sku: "",
  price: "",
  originalPrice: "",
  stock: "",
  imageUrl: "",
  optionValueIds: [],
};
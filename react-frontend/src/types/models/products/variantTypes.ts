import type { AddImagePayload } from "../../../api/admin/adminProductsApi";
import type { ProductOption } from "./ProductOption";

export interface VariantRow {
  key: string;
  variantName: string;
  sku: string;
  originalPrice: number;
  price: number;
  stock: number;
  images: AddImagePayload[];
  imageInput: string;
  open: boolean;
  optionValueIds: number[];
  serverId: number;
}

export interface SkuContext {
  categoryName: string;
  productName: string;
}

export interface GenerateRowsParams {
  selectedOptionValueIds: number[];
  filters: ProductOption[];
  existingRows: VariantRow[];
  skuContext: SkuContext;
}
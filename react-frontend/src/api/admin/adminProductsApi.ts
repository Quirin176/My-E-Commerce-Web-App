import { apiClient } from "../apiClient";

export interface VariantImagePayload {
  imageUrl: string;
  displayOrder: number;
  isMain: boolean;
}

export interface VariantPayload {
  variantName: string;
  sku?: string;
  price: number;
  originalPrice: number;
  stock: number;
  optionValueIds: number[];
  imageUrls: VariantImagePayload[];
}

export interface ProductPayload {
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  basePrice?: number;
  thumbnailUrl?: string;
  categoryId?: number;
  selectedOptionValueIds?: number[];
  hasVariants: boolean;

  variants?: VariantPayload[];
};

export const adminProductsApi = {

  async createProduct(data: ProductPayload) {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  async updateProductById(id: number | string, data: ProductPayload) {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id: number | string) {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },
};

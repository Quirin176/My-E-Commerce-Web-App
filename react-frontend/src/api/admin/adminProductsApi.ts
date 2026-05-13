import { apiClient } from "../apiClient";

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
};

export interface VariantImagePayload {
  imageUrl: string;
  displayOrder: number;
  isMain: boolean;
}

export interface ProductVariantPayload {
  variantName: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  productId: number | string;

  imageUrls: VariantImagePayload[];

  optionValueIds: number[];
}

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

  async createVariant(data: ProductVariantPayload) {
    const res = await apiClient.post("/productvariants", data);
    return res.data;
  },

  async createVariants(id: number, data: ProductVariantPayload[]) {
    const res = await apiClient.post(`/productvariants/product/${id}`, data);
    return res.data;
  },

  async updateVariant(id: number | string, data: ProductVariantPayload) {
    const res = await apiClient.put(`/productvariants/${id}`, { ...data, id });
    return res.data;
  },

  async updateVariants(id: number | string, data: ProductVariantPayload[]) {
    const res = await apiClient.put(`/productvariants/${id}`, { ...data, id });
    return res.data;
  },

  async delete(id: number | string) {
    const res = await apiClient.delete(`/productvariants/${id}`);
    return res.data;
  },
};

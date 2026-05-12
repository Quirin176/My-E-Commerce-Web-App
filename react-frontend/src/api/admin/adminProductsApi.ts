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

export const adminProductsApi = {

  async createProduct(data: ProductPayload) {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  async updateProductById(id: number | string, data: ProductPayload) {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  async updateProductBySlug(slug: string, data: ProductPayload) {
    const res = await apiClient.put(`/products/${slug}`, data);
    return res.data;
  },

  async deleteProduct(id: number | string) {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },
};

import { apiClient } from "../apiClient";

export interface UpdatedProductPayload {
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  imgUrl?: string;
  imgUrls?: string[];
  categoryId?: number;
  options?: { optionId: number; valueId: number }[];
};

export const adminProductsApi = {

  async createProduct(data: UpdatedProductPayload) {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  async updateProductById(id: number | string, data: UpdatedProductPayload) {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  async updateProductBySlug(slug: string, data: UpdatedProductPayload) {
    const res = await apiClient.put(`/products/${slug}`, data);
    return res.data;
  },

  async deleteProduct(id: number | string) {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },
};

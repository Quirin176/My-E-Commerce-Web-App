import { apiClient } from "../apiClient";
import type { Product } from "../../types/models/Product";

export const adminProductsApi = {
  getProductsAll: async () => {
    const res = await apiClient.get("/products");
    return res.data;
  },

  getProductById: async (id: number | string) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  getProductBySlug: async (slug: string) => {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
  },

  getProductByCategory: async (category: string) => {
    const res = await apiClient.get(`/products/${category}`);
    return res.data;
  },

  createProduct: async (data: Product) => {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  updateProductById: async (id: number | string, data: Product) => {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  updateProductBySlug: async (slug: string, data: Product) => {
    const res = await apiClient.put(`/products/${slug}`, data);
    return res.data;
  },

  deleteProduct: async (id: number | string) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  }
};

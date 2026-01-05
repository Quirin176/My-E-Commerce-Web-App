import { apiClient } from "../apiClient";
import type { Product } from "../../types/models/Product";

export const adminProductsApi = {
  getProducts: async () => {
    const res = await apiClient.get("/products");
    return res.data;
  },

  getProductById: async (id: number) => {
    const res = await apiClient.get(`/products/${id}`);
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

  updateProduct: async (id: number, data: Product) => {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id: number) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  }
};

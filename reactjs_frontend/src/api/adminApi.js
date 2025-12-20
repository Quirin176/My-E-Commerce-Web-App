import { apiClient } from "./apiClient";

export const adminApi = {
  getProducts: async () => {
    const res = await apiClient.get("/products");
    return res.data;
  },

  getProductById: async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  getProductByCategory: async (category) => {
    const res = await apiClient.get(`/products/${category}`);
    return res.data;
  },

  createProduct: async (data) => {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  updateProduct: async (id, data) => {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  }
};

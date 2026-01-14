import { apiClient } from "../apiClient";

export const categoryApi = {

  // Get all categories (id, name, slug)
  getAll: async () => {
    const res = await apiClient.get("/categories");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get(`/categories/${id}`);
    return res.data;
  },

  getBySlug: async (slug: string) => {
    const res = await apiClient.get(`/categories/${slug}`);
    return res.data;
  },
};

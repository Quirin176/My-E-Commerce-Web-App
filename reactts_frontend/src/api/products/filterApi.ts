import { apiClient } from "../apiClient";

export const filterApi = {
  getFiltersByCategory: async (slug: string) => {
    try {
      const res = await apiClient.get(`/filters/category/${slug}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // Get filters by category ID (for admin form)
  getFiltersByCategoryId: async (categoryId: number) => {
    try {
      const res = await apiClient.get(`/filters/category-id/${categoryId}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },
};

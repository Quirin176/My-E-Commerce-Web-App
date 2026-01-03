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
  // Create an option value
  createOptionValue: async (optionId: number, value: string) => {
    const res = await apiClient.post(`/filters/option-values`, { 
      optionId,
      value
    });
    return res.data;
  },

  updateOptionValue: async (optionValueId: number, value: string) => {
    const res = await apiClient.put(`/filters/option-values/${optionValueId}`, { 
      value
    });
    return res.data;
  },

  // Delete an option value
  deleteOptionValue: async (optionValueId: number) => {
    const res = await apiClient.delete(`/filters/option-values/${optionValueId}`);
    return res.data;
  },
};

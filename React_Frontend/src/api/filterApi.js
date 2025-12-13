import { apiClient } from "./apiClient";

export const filterApi = {
  getFiltersByCategory: async (slug) => {
    try {
      const res = await apiClient.get(`/filters/category/${slug}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // Get filters by category ID (for admin form)
  getFiltersByCategoryId: async (categoryId) => {
    try {
      const res = await apiClient.get(`/filters/category-id/${categoryId}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },
  
  createOptionValue: async (optionId, value) => {
    const res = await apiClient.post(`/filters/option-values`, { 
      optionId,
      value
    });
    return res.data;
  },

  // NEW: Delete an option value
  deleteOptionValue: async (optionValueId) => {
    const res = await apiClient.delete(`/filters/option-values/${optionValueId}`);
    return res.data;
  },
};

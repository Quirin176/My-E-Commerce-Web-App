import { apiClient } from "./apiClient";

export const productoptionApi = {
  // Get all options for a category
  getOptionsByCategoryId: async (categoryId) => {
    const res = await apiClient.get(`/filters/category-id/${categoryId}`);
    return res.data;
  },

  // Create a new option value for an existing option
  createOptionValue: async (optionId, value) => {
    const res = await apiClient.post(`/product-options/${optionId}/values`, { value });
    return res.data;
  },

  // Create a new product option for a category
  createProductOption: async (categoryId, name) => {
    const res = await apiClient.post(`/product-options`, { categoryId, name });
    return res.data;
  },
  
};

import { apiClient } from "../apiClient";

export const productoptionApi = {
  // Get all options for a category
  getOptionsByCategoryId: async (categoryId: number | string) => {
    const res = await apiClient.get(`/filters/category-id/${categoryId}`);
    return res.data;
  },
  
  createOptionValue: async (optionId: number | string, value: string) => {
    const res = await apiClient.post(`/filters/option-values`, { 
      optionId,
      value
    });
    return res.data;
  },

  // Create a new product option for a category
  createProductOption: async (categoryId: number | string, name: string) => {
    const res = await apiClient.post(`/productoptions`, { categoryId, name });
    return res.data;
  },
};

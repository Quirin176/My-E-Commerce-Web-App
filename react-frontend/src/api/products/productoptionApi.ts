import { apiClient } from "../apiClient";

export const productoptionApi = {
  // GET: api/filters/category/id/:id Get all options for a category
  getOptionsByCategoryId: async (categoryId: number | string) => {
    const res = await apiClient.get(`/filters/category/id/${categoryId}`);
    return res.data;
  },
  
  // POST: api/filters/option-values - Create a new option value for an option
  createOptionValue: async (optionId: number | string, value: string) => {
    const res = await apiClient.post(`/filters/optionvalues`, { 
      optionId,
      value
    });
    return res.data;
  },

  // POST: api/productoptions - Create a new product option for a category
  createProductOption: async (categoryId: number | string, name: string) => {
    const res = await apiClient.post(`/productoptions`, { categoryId, name });
    return res.data;
  },
};

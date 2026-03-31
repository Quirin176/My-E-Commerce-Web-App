import { apiClient } from "../apiClient";

export const productoptionApi = {
  // GET: api/filters/category/id/:id Get all options for a category
  getOptionsByCategoryId: async (categoryId: number | string) => {
    const res = await apiClient.get(`/productoptions/category/id/${categoryId}`);
    return res.data;
  },
  
  // POST: api/productoptions - Create a new product option for a category
  createProductOption: async (categoryId: number | string, name: string) => {
    const res = await apiClient.post(`/productoptions`, { categoryId, name });
    return res.data;
  },

  // DELETE: api/productoptions/:id - Delete a product option by ID
  deleteProductOption: async (optionId: number | string) => {
    const res = await apiClient.delete(`/productoptions/${optionId}`);
    return res.data;
  },
};

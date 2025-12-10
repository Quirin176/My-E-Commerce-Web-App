import { apiClient } from "./apiClient";

export const productApi = {
  async getAll() {
    const res = await apiClient.get("/products");
    return res.data;
  },

  async getByFilters(category, filters = {}) {
    const params = {
      category: category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      priceOrder: filters.priceOrder,
      options: filters.options,
    };

    const res = await apiClient.get("/products", { params });
    return res.data;
  },

  // async getByCategories(category, filters = {}) {
  //   const params = {
  //     category: category,
  //     priceOrder: filters.priceOrder,
  //     options: filters.options,
  //   };

  //   const res = await apiClient.get("/products", { params });
  //   return res.data;
  // },

  async getById(id) {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  }
};

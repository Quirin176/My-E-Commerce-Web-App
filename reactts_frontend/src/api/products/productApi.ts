import { apiClient } from "../apiClient";

export const productApi = {

  // GET: /api/products
  async getAll() {
    const res = await apiClient.get("/products");
    return res.data;
  },

  // GET: /api/products with filters
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

  // GET: /api/products/{id}
  async getById(id) {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  // GET: /api/products/slug/{slug}
  async getBySlug(slug) {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
  }

};

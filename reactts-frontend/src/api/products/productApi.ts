import { apiClient } from "../apiClient";

export const productApi = {

  // GET: /api/products
  async getProductsAll() {
    const res = await apiClient.get("/products");
    return res.data;
  },

  // GET: /api/products with filters
  async getByFilters(category: string, filters = {}) {
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

  // GET: /api/products/{id} - Get all data of a product by id
  async getProductById(id: number | string) {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  // GET: /api/products/slug/{slug} - Get all data of a product by slug
  async getProductBySlug(slug: string) {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
  }

};

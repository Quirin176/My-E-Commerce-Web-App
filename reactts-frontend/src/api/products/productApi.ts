import { apiClient } from "../apiClient";

interface Filters {
  minPrice: number,
  maxPrice: number,
  sortOrder: string,
  options: string,
};

export const productApi = {

  // GET: /api/products - Get all products
  async getProductsAll() {
    const res = await apiClient.get("/products");
    return res.data;
  },

  // GET: api/products/categories/${categorySlug} - Get all products in a Category
  async getProductsByCategory(categorySlug: string) {
    const res = await apiClient.get(`/products/categories/${categorySlug}`);
    return res.data;
  },

  // GET: /api/products/filter with filters
  async getProductsByFilters(category: string, filters: Filters) {
    const params = {
      category: category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortOrder: filters.sortOrder,
      options: filters.options,
    };

    const res = await apiClient.get("/products/filter", { params });
    return res.data;
  },

  // GET: /api/products/{id} - Get all data of a product by id
  async getProductsById(id: number | string) {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  // GET: /api/products/{slug} - Get all data of a product by slug
  async getProductsBySlug(slug: string) {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
  }

};

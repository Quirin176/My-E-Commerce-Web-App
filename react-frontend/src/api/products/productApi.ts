import { apiClient } from "../apiClient";

interface Filters {
  minPrice: number,
  maxPrice: number,
  sortOrder: string,
  options: string,
};

interface SearchFilters {
  minPrice: number,
  maxPrice: number,
  sortOrder: string,
}

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
  async getProductById(id: number | string) {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  // GET: /api/products/{slug} - Get all data of a product by slug
  async getProductBySlug(slug: string) {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
  },

  // Main search with filters and pagination
  async search(query: string, page = 1, pageSize = 10, filters: SearchFilters) {
    try {
      const params = {
        q: query,
        page: page,
        pageSize: pageSize,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortOrder: filters.sortOrder,
      };

      const res = await apiClient.get("/products/search", { params });
      return res.data;
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  },

  // Get search suggestions as user types
  async getSuggestions(query: string, limit = 10) {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      const res = await apiClient.get("/products/search/suggestions", {
        params: { q: query, limit }
      });
      return res.data;
    } catch (error) {
      console.error("Suggestions error:", error);
      return [];
    }
  }

};

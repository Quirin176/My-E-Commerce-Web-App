import { apiClient } from "./apiClient";

export const searchApi = {
  // Main search with filters and pagination
  search: async (query, page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = {
        q: query,
        page: page,
        pageSize: pageSize,
        minPrice: filters.minPrice || 0,
        maxPrice: filters.maxPrice || 9999999,
        sortBy: filters.sortBy || "relevance"
      };

      const res = await apiClient.get("/products/search", { params });
      return res.data;
    } catch (error) {
      console.error("Search error:", error);
      throw error;
    }
  },

  // Get search suggestions as user types
  getSuggestions: async (query, limit = 10) => {
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
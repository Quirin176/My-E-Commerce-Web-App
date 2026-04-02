import { apiClient } from "../apiClient";
import type { Product } from "../../types/models/products/Product";

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

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
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

  // GET: /api/products/filters with filters
  async getProductsByFilters(category: string, filters: Filters) {
    const params = {
      category: category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortOrder: filters.sortOrder,
      options: filters.options,
    };

    const res = await apiClient.get("/products/filters", { params });
    return res.data;
  },

  // Get paginated products with search and sorting
  async getProductsPaginated(
    page = 1,
    pageSize = 10,
    search?: string,
    sortBy = "id",
    sortOrder = "desc",
    filters?: {
      category?: string | null;
      minPrice?: number;
      maxPrice?: number;
      options?: (string | number)[];
      sortOrder?: "newest" | "oldest" | "ascending" | "descending";
    }
  ) {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("pageSize", String(pageSize));
    if (search) params.append("search", search);
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    if (filters) {
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
      if (filters.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
      if (filters.options && filters.options.length > 0) params.append("options", filters.options.join(","));
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    }
    const res = await apiClient.get<PaginatedResponse<Product>>(`/products/paginated?${params.toString()}`);
    return res.data;
  },

  // GET: /api/products/{id} - Get all data of a product by id
  async getProductById(id: number | string) {
    const res = await apiClient.get(`/products/id/${id}`);
    return res.data;
  },

  // GET: /api/products/{slug} - Get all data of a product by slug
  async getProductBySlug(slug: string) {
    const res = await apiClient.get(`/products/slug/${slug}`);
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

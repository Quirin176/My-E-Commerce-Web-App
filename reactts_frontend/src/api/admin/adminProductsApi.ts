import { apiClient } from "../apiClient";
import type { Product } from "../../types/models/Product";

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
}

export const adminProductsApi = {
  getProductsAll: async () => {
    const res = await apiClient.get("/products");
    return res.data;
  },

  getProductById: async (id: number | string) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  getProductBySlug: async (slug: string) => {
    const res = await apiClient.get(`/products/${slug}`);
    return res.data;
  },

  getProductByCategory: async (category: string) => {
    const res = await apiClient.get(`/products/${category}`);
    return res.data;
  },

  // Get paginated products with search and sorting
  async getProductsPaginated(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    sortBy: string = "id",
    sortOrder: string = "desc"
  ) {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("pageSize", String(pageSize));
      if (search) params.append("search", search);
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const res = await apiClient.get<PaginatedResponse<Product>>(
        `/products/admin/paginated?${params.toString()}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching paginated products:", error);
      throw error;
    }
  },

  createProduct: async (data: Product) => {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  updateProductById: async (id: number | string, data: Product) => {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  updateProductBySlug: async (slug: string, data: Product) => {
    const res = await apiClient.put(`/products/${slug}`, data);
    return res.data;
  },

  deleteProduct: async (id: number | string) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  }
};

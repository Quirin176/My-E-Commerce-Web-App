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
};
export interface ProductFilterParams {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  options?: number[];          // array of option value IDs
  priceOrder?: "newest" | "oldest" | "ascending" | "descending";
}

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  shortDescription: string;
  options: {
    optionName: string;
    value: string;
  }[];
}

export interface UpdatedProductPayload {
  name?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  imgUrl?: string;
  imgUrls?: string[];
  categoryId?: number;
  options?: { optionId: number; valueId: number }[];
};

export const adminProductsApi = {
  async getProductsAll() {
    const res = await apiClient.get("/products");
    return res.data;
  },

  async getProductByCategory(category: string) {
    const res = await apiClient.get(`/products/${category}`);
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
    priceOrder?: "newest" | "oldest" | "ascending" | "descending";
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
    if (filters.priceOrder) params.append("priceOrder", filters.priceOrder);
  }
  const res = await apiClient.get<PaginatedResponse<Product>>(`/products/admin/paginated?${params.toString()}`);
  return res.data;
},

  async createProduct(data: UpdatedProductPayload) {
    const res = await apiClient.post("/products", data);
    return res.data;
  },

  async updateProductById(id: number | string, data: UpdatedProductPayload) {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },

  async updateProductBySlug(slug: string, data: UpdatedProductPayload) {
    const res = await apiClient.put(`/products/${slug}`, data);
    return res.data;
  },

  async deleteProduct(id: number | string) {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },

  // Create an option value
  async createOptionValue(optionId: number, value: string) {
    const res = await apiClient.post(`/filters/option-values`, {
      optionId,
      value
    });
    return res.data;
  },

  async updateOptionValue(optionValueId: number, value: string) {
    const res = await apiClient.put(`/filters/option-values/${optionValueId}`, {
      value
    });
    return res.data;
  },

  // Delete an option value
  async deleteOptionValue(optionValueId: number) {
    const res = await apiClient.delete(`/filters/option-values/${optionValueId}`);
    return res.data;
  },
};

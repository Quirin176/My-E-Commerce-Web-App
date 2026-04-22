import { apiClient } from "../apiClient";
import type { User } from "../../types/models/auth/User";

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

export const adminUsersApi = {

  async getProfileByEmail(email: string) {
    const res = await apiClient.get(`/user/admin/email/${email}`);
    return res.data;
  },

  async getProfileByPhone(phone: string) {
    const res = await apiClient.get(`/user/admin/phone/${phone}`);
    return res.data;
  },

  async getAllProfile() {
    const res = await apiClient.get("/user/admin");
    return res.data;
  },

  async getProfilesByRole(role: string) {
    const res = await apiClient.get(`/user/admin/role/${role}`);
    return res.data;
  },

  async getProfilesByFilters(
    search: string,
    role: string,
    sortBy: string,
    sortOrder: string,
    page = 1,
    pageSize = 10,
  ) {
    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (role) params.append('role', role);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      params.append("page", String(page));
      params.append("pageSize", String(pageSize));

      const res = await apiClient.get<PaginatedResponse<User>>(`/user/admin/filters?${params.toString()}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // updateProfile: async (profile) => {
  //   const res = await apiClient.put("/user/profile", profile);
  //   return res.data;
  // }
};

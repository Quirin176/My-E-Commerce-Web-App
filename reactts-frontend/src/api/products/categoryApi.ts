import { apiClient } from "../apiClient";

export const categoryApi = {

  // Get data (id, name, slug) of each category
  async getAll() {
    try {
      const res = await apiClient.get("/categories");
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // Get category data by ID - id, name, slug
  async getById(id: number) {
    try {
      const res = await apiClient.get(`/categories/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // Get category data by Slug - id, name, slug
  async getBySlug(slug: string) {
    try {
      const res = await apiClient.get(`/categories/${slug}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // Get all options and all their optionvalues for a category by slug
  async getFiltersBySlug(slug: string) {
    try {
      const res = await apiClient.get(`/filters/category/${slug}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // Get all options and all their optionvalues for a category by ID
  async getFiltersById(id: number) {
    try {
      const res = await apiClient.get(`/filters/category-id/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },
};

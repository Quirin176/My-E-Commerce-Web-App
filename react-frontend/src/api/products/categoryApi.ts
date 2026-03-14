import { apiClient } from "../apiClient";

export const categoryApi = {

  // GET: api/categories - Get data (id, name, slug) of each category
  async getAll() {
    try {
      const res = await apiClient.get("/categories");
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // GET: api/categories/id/:id - Get category data by ID - id, name, slug
  async getById(id: number) {
    try {
      const res = await apiClient.get(`/categories/id/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // GET: api/categories/slug/:slug - Get category data by Slug - id, name, slug
  async getBySlug(slug: string) {
    try {
      const res = await apiClient.get(`/categories/slug/${slug}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // GET: api/productoptions/category/slug/:slug - Get all options and all their optionvalues for a category by slug
  async getAllChildDataByCategorySlug(slug: string) {
    try {
      const res = await apiClient.get(`/productoptions/category/slug/${slug}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },

  // GET: api/productoptions/category/id/:id - Get all options and all their optionvalues for a category by ID
  async getAllChildDataByCategoryId(id: number) {
    try {
      const res = await apiClient.get(`/productoptions/category/id/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error loading filters:", error);
      return [];
    }
  },
};

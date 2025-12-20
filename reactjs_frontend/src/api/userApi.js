import { apiClient } from "./apiClient";

export const userApi = {
  getProfile: async () => {
    const res = await apiClient.get("/user/profile");
    return res.data;
  },

  updateProfile: async (profile) => {
    const res = await apiClient.put("/user/profile", profile);
    return res.data;
  }
};

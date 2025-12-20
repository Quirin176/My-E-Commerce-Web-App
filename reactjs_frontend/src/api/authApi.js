import { apiClient } from "./apiClient";

export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  },

  signup: async (user) => {
    const res = await apiClient.post("/auth/signup", user);
    return res.data;
  },
};
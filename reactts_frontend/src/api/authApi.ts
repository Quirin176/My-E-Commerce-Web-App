import type { User } from "../types/models/User";
import { apiClient } from "./apiClient";

export const authApi = {
  login: async (email : string, password : string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  },

  signup: async (user : User) => {
    const res = await apiClient.post("/auth/signup", user);
    return res.data;
  },
};

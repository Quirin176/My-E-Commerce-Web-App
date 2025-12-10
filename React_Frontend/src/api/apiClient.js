import axios from "axios";
import { siteConfig } from "../config/siteConfig";

export const apiClient = axios.create({
  baseURL: siteConfig.API_URL,
  headers: { "Content-Type": "application/json" },
  // timeout: 10000,
});

// Automatically attach JWT to every request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler
// apiClient.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/auth/login";
//     }
//     return Promise.reject(err);
//   }
// );
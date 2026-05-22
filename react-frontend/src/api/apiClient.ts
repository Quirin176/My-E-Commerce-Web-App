import axios from "axios";
import { API_URL } from "../config/siteConfig";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  // Auto-add token
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Optional per-request no-cache
  if (config.noCache === true) {
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";
  }

  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/home";
    }
    return Promise.reject(error);
  }
);

// Global Default Headers
apiClient.defaults.headers.common["Accept"] = "application/json";
apiClient.defaults.headers.common["Content-Type"] = "application/json";
apiClient.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
import axios from "axios";
import { siteConfig } from "../config/siteConfig";

export const apiClient = axios.create({
  baseURL: siteConfig.API_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach JWT to every request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      // console.log("[API Client] Request to:", config.url);
      // console.log("[API Client] Token exists:", !!token);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log("[API Client] Authorization header set");
      } else {
        // console.warn("[API Client] No token found in localStorage");
      }
    }
    return config;
  },
  (error) => {
    console.error("[API Client] Request error:", error);
    return Promise.reject(error);
  }
);

// Response error handler
apiClient.interceptors.response.use(
  (response) => {
    // console.log("[API Client] Response success:", response.status);
    return response;
  },

  (error) => {
    // console.error("[API Client] Response error:", error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      // console.warn("[API Client] 401 Unauthorized - Token may be expired or invalid");
      const token = localStorage.getItem("token");

      // Only redirect if the user was already logged in (token existed)
      // If no token, this is just a failed login attempt — let the component handle it
      if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login
        window.location.href = "/auth?mode=login";
      }      
    }
    
    return Promise.reject(error);
  }
);

import axios from "axios";
import { API_URL } from "../config/siteConfig";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Required for HttpOnly cookies
});

// Response error handler
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    // Redirect on unauthorized
    if (error.response?.status === 401) {
      window.location.href = "/home";
    }

    return Promise.reject(error);
  }
);

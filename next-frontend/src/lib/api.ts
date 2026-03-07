import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (data: any) => api.post('/auth/signup', data),
  login: (data: any) => api.post('/auth/login', data),
};

// Products endpoints
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: number) => api.get(`/products/${id}`),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  search: (q: string, page = 1, pageSize = 10) =>
    api.get('/products/search', { params: { q, page, pageSize } }),
  getFilter: (params: any) => api.get('/products/filter', { params }),
};

// Categories endpoints
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: number) => api.get(`/categories/${id}`),
};

// Filters endpoints
export const filtersAPI = {
  getByCategory: (categorySlug: string) =>
    api.get(`/filters/category/${categorySlug}`),
};

// Orders endpoints
export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getById: (id: number) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get('/orders/user/my-orders'),
  updateStatus: (id: number, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};

// Admin endpoints
export const adminAPI = {
  getAllOrders: (params?: any) => api.get('/admin-orders', { params }),
  getOrderDetail: (id: number) => api.get(`/admin-orders/${id}`),
  updateOrder: (id: number, data: any) => api.put(`/admin-orders/${id}`, data),
  deleteOrder: (id: number) => api.delete(`/admin-orders/${id}`),
  getStats: () => api.get('/admin-orders/stats'),
  exportOrders: (status?: string) =>
    api.get('/admin-orders/export', { params: { status }, responseType: 'blob' }),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
};

export default api;
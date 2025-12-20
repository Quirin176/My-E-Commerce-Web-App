import { apiClient } from "./apiClient";

export const orderApi = {
  // GET: /api/orders - Get all orders with optional filters
  async getAll(filters = {}) {
    const params = {
      status: filters.status,
      minDate: filters.minDate,
      maxDate: filters.maxDate,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    const res = await apiClient.get("/orders", { params });
    return res.data;
  },

  // GET: /api/orders/{id} - Get order by ID
  async getById(id) {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data;
  },

  // PUT: /api/orders/{id}/status - Update order status
  async updateStatus(id, status) {
    const res = await apiClient.put(`/orders/${id}/status`, { status });
    return res.data;
  },

  // PUT: /api/orders/{id} - Update order details
  async updateOrder(id, data) {
    const res = await apiClient.put(`/orders/${id}`, data);
    return res.data;
  },

  // DELETE: /api/orders/{id} - Delete order
  async deleteOrder(id) {
    const res = await apiClient.delete(`/orders/${id}`);
    return res.data;
  },

  // GET: /api/orders/export - Export orders as CSV
  async exportOrders(filters = {}) {
    const params = {
      status: filters.status,
      format: "csv"
    };

    const res = await apiClient.get("/orders/export", { 
      params,
      responseType: 'blob'
    });
    return res.data;
  },

  // GET: /api/orders/stats - Get order statistics
  async getStats() {
    const res = await apiClient.get("/orders/stats");
    return res.data;
  },

  // POST: /api/orders/{id}/send-email - Send order confirmation email
  async sendConfirmationEmail(id) {
    const res = await apiClient.post(`/orders/${id}/send-email`);
    return res.data;
  }
};

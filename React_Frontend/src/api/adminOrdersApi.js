import { apiClient } from "./apiClient";

export const adminOrdersApi = {
  // GET all orders with filters
  async getAllOrders(filters = {}) {
    try {
      const params = {
        status: filters.status || null,
        minDate: filters.minDate || null,
        maxDate: filters.maxDate || null,
        sortBy: filters.sortBy || "orderDate",
        sortOrder: filters.sortOrder || "desc",
      };

      const res = await apiClient.get("/admin-orders", { params });
      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // GET order detail by ID
  async getOrderDetail(orderId) {
    try {
      const res = await apiClient.get(`/admin-orders/${orderId}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // UPDATE order status
  async updateOrderStatus(orderId, status) {
    try {
      const res = await apiClient.put(`/admin-orders/${orderId}/status`, {
        status: status,
      });
      return res.data;
    } catch (error) {
      console.error(`Error updating order status:`, error);
      throw error;
    }
  },

  // UPDATE entire order
  async updateOrder(orderId, orderData) {
    try {
      const res = await apiClient.put(`/admin-orders/${orderId}`, orderData);
      return res.data;
    } catch (error) {
      console.error(`Error updating order:`, error);
      throw error;
    }
  },

  // DELETE order
  async deleteOrder(orderId) {
    try {
      const res = await apiClient.delete(`/admin-orders/${orderId}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting order:`, error);
      throw error;
    }
  },

  // EXPORT orders as CSV
  async exportOrders(status = null) {
    try {
      const params = {
        status: status || null,
      };

      const res = await apiClient.get("/admin-orders/export", {
        params,
        responseType: "blob",
      });
      return res.data;
    } catch (error) {
      console.error("Error exporting orders:", error);
      throw error;
    }
  },

  // GET order statistics
  async getOrderStats() {
    try {
      const res = await apiClient.get("/admin-orders/stats");
      return res.data;
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      throw error;
    }
  },

  // SEND confirmation email
  async sendConfirmationEmail(orderId) {
    try {
      const res = await apiClient.post(`/admin-orders/${orderId}/send-email`);
      return res.data;
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      throw error;
    }
  },
};

import { apiClient } from "../apiClient";

// export interface AdminOrdersFilters {
//   status: string,
//   minDate: string,
//   maxDate: string,
//   sortBy: string,
//   sortOrder: string
// }

export const adminOrdersApi = {
  // GET /api/AdminOrders - Get all orders with filters
  async getAllOrders(
    status: string,
    minDate: string,
    maxDate: string,
    sortBy: string,
    sortOrder: string) {
    try {
      // Use the existing /orders endpoint with filters
      const params = new URLSearchParams();

      if (status) params.append('status', status);
      if (minDate) params.append('minDate', minDate);
      if (maxDate) params.append('maxDate', maxDate);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const res = await apiClient.get(`/orders/admin/all-orders?${params.toString()}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // GET order detail by ID
  async getOrderDetail(orderId: number) {
    try {
      const res = await apiClient.get(`/AdminOrders/${orderId}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // UPDATE order status
  async updateOrderStatus(orderId: number | string, status: string) {
    try {
      const res = await apiClient.put(`/AdminOrders/${orderId}/status`, {
        status: status,
      });
      return res.data;
    } catch (error) {
      console.error(`Error updating order status:`, error);
      throw error;
    }
  },

  // // UPDATE entire order
  // async updateOrder(orderId: number, orderData) {
  //   try {
  //     const res = await apiClient.put(`/AdminOrders/${orderId}`, orderData);
  //     return res.data;
  //   } catch (error) {
  //     console.error(`Error updating order:`, error);
  //     throw error;
  //   }
  // },

  // DELETE order
  async deleteOrder(orderId: number | string) {
    try {
      const res = await apiClient.delete(`/AdminOrders/${orderId}`);
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

      const res = await apiClient.get("/AdminOrders/export", {
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
      const res = await apiClient.get("/AdminOrders/stats");
      return res.data;
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      throw error;
    }
  },

  // SEND confirmation email
  async sendConfirmationEmail(orderId: number) {
    try {
      const res = await apiClient.post(`/AdminOrders/${orderId}/send-email`);
      return res.data;
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      throw error;
    }
  },
};

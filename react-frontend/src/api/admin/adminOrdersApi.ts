import { apiClient } from "../apiClient";
import type { PaginatedResponse } from "../../types/dto/PaginatedResponse";
import type { OrderStatus } from "../../types/orderStatus";
import type { OrderResponse } from "../../types/models/order/OrderResponse";

export const adminOrdersApi = {

  // GET /api/adminorders?status=&minDate=&maxDate=&sortBy=&sortOrder= - Get all orders with filters
  async getAllOrders(
    page = 1,
    pageSize = 10,
    status: OrderStatus,
    minDate: string,
    maxDate: string,
    sortBy: string,
    sortOrder: string) {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("pageSize", String(pageSize));

      if (status) params.append('status', status);
      if (minDate) params.append('minDate', minDate);
      if (maxDate) params.append('maxDate', maxDate);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const res = await apiClient.get<PaginatedResponse<OrderResponse>>(`/adminorders?${params.toString()}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // GET /api/adminorders/{id} - Get order detail by ID
  async getOrderDetail(orderId: number | string) {
    try {
      const res = await apiClient.get(`/adminorders/${orderId}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // UPDATE order status
  async updateOrderStatus(orderId: number | string, status: string) {
    try {
      const res = await apiClient.put(`/adminorders/${orderId}/status`, {
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
  //     const res = await apiClient.put(`/adminorders/${orderId}`, orderData);
  //     return res.data;
  //   } catch (error) {
  //     console.error(`Error updating order:`, error);
  //     throw error;
  //   }
  // },

  // EXPORT orders as CSV
  async exportOrders(
    status: OrderStatus,
    minDate: string,
    maxDate: string,
    sortBy: string,
    sortOrder: string) {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (minDate) params.append('minDate', minDate);
      if (maxDate) params.append('maxDate', maxDate);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const res = await apiClient.get("/adminorders/export", {
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
      const res = await apiClient.get("/adminorders/stats");
      return res.data;
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      throw error;
    }
  },

  // SEND confirmation email
  async sendConfirmationEmail(orderId: number) {
    try {
      const res = await apiClient.post(`/adminorders/${orderId}/send-email`);
      return res.data;
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      throw error;
    }
  },
};

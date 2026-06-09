import { apiClient } from "../apiClient";
import type { OrderStatus } from "../../types/orderStatus";

interface OrderFilters {
  status?: OrderStatus;
  minDate?: string;
  maxDate?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface UpdateOrderRequest {
  customerName?: string;
  shippingAddress?: string;
  notes?: string;
}

export const orderApi = {
  // GET: /api/orders - Get all orders with optional filters
  async getOrderByFilters(filters: OrderFilters) {
    const res = await apiClient.get("/orders", { params: filters });
    return res.data;
  },

  // GET: /api/orders/id/{id:int}/details - Get order by ID
  async getOrderById(orderId: number | string) {
    const res = await apiClient.get(`/orders/id/${orderId}/details`);
    return res.data;
  },

  // GET: /api/orders/id/{id:int}/detailswithitems - Get order with items by ID
  async getOrderWithItemsById(orderId: number | string | undefined) {
    const res = await apiClient.get(`/orders/id/${orderId}/detailswithitems`);
    return res.data;
  },

  // Get user's orders
  async getUserAllOrders() {
    const res = await apiClient.get("/orders/user/all");
    return res.data;
  },

  // PUT: /api/orders/{id} - Update order details
  async updateOrder(orderId: number | string, data: any) {
    const res = await apiClient.put(`/orders/id/${orderId}`, data);
    return res.data;
  },

  // PUT: /api/orders/{id}/status - Update order status
  async updateStatus(orderId: number | string, status: OrderStatus) {
    const res = await apiClient.put(`/orders/id/${orderId}/status`, { status });
    return res.data;
  },

  // DELETE: /api/orders/{id} - Delete order
  async deleteOrder(orderId: number | string) {
    const res = await apiClient.delete(`/orders/id/${orderId}`);
    return res.data;
  },

  // GET: /api/orders/export - Export orders as CSV
  async exportOrders(filters: OrderFilters) {
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
  async getOrderStats() {
    const res = await apiClient.get("/orders/stats");
    return res.data;
  },

  // POST: /api/orders/{id}/send-email - Send order confirmation email
  async sendConfirmationEmail(id: number | string) {
    const res = await apiClient.post(`/orders/id/${id}/send-email`);
    return res.data;
  }
};

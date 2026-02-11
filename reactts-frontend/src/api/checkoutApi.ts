import { apiClient } from "./apiClient";
import type { OrderRequestModel } from "../types/models/order/OrderRequestModel";

export const checkoutApi = {
  // Create an order
  async createOrder(orderData: OrderRequestModel) {
    try {
      const res = await apiClient.post("/orders", orderData);
      return res.data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  // Get order by ID
  async getOrder(orderId: number | string | undefined) {
    try {
      const res = await apiClient.get(`/orders/${orderId}`);
      return res.data;
    } catch (error) {
      console.error("Get order error:", error);
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders() {
    try {
      const res = await apiClient.get("/orders/user/my-orders");
      return res.data;
    } catch (error) {
      console.error("Get user orders error:", error);
      throw error;
    }
  }
};

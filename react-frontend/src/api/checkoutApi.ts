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
};

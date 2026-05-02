import { apiClient } from "./apiClient";

interface OrderRequestModel {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  totalAmount: number;
  paymentMethod: string;
  orderItems: {
    productId: number | string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  status: string;
  notes?: string;
}

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

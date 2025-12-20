import { apiClient } from "./apiClient";

export const checkoutApi = {
  // Create an order
  createOrder: async (orderData) => {
    try {
      const res = await apiClient.post("/orders", orderData);
      return res.data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  },

  // Create a payment intent with Stripe
  createPaymentIntent: async (amount, orderId) => {
    try {
      const res = await apiClient.post("/payments/create-intent", {
        amount: amount,
        orderId: orderId
      });
      return res.data;
    } catch (error) {
      console.error("Payment intent error:", error);
      throw error;
    }
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    try {
      const res = await apiClient.post("/payments/confirm", {
        paymentIntentId: paymentIntentId,
        paymentMethodId: paymentMethodId
      });
      return res.data;
    } catch (error) {
      console.error("Payment confirmation error:", error);
      throw error;
    }
  },

  // Get order by ID
  getOrder: async (orderId) => {
    try {
      const res = await apiClient.get(`/orders/${orderId}`);
      return res.data;
    } catch (error) {
      console.error("Get order error:", error);
      throw error;
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      const res = await apiClient.get("/orders/user/my-orders");
      return res.data;
    } catch (error) {
      console.error("Get user orders error:", error);
      throw error;
    }
  }
};

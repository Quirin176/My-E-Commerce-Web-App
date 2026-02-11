export interface OrderRequestModel {
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

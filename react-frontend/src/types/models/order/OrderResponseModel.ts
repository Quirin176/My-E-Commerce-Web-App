export interface OrderResponseModel {
  id: number | string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  orderDate: string;
  notes?: string;
  itemCount: number;
  items: {
    productId: number | string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: 'Customer' | 'Admin';
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  shortDescription?: string;
  description?: string;
  categoryId: number;
  category?: Category;
  images?: string[];
  options?: ProductOption[];
}

export interface ProductOption {
  optionId: number;
  name: string;
  optionValues?: OptionValue[];
}

export interface OptionValue {
  optionValueId: number;
  value: string;
}

export interface CartItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  orderDate: string;
  notes?: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

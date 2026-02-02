import type { CartItem } from "../models/cart/CartItem";

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

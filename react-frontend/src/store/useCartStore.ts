import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types/models/cart/CartItem";

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (item, quantity) => {
        set((state) => {
          const existing = state.cartItems.find((c) => c.id === item.id);
          if (existing) {
            return {
              cartItems: state.cartItems.map((c) =>
                c.id === item.id ? { ...c, quantity: c.quantity + quantity } : c
              ),
            };
          }
          return { cartItems: [...state.cartItems, { ...item, quantity }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((c) => c.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set((state) => ({
            cartItems: state.cartItems.filter((c) => c.id !== productId),
          }));
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.map((c) =>
            c.id === productId ? { ...c, quantity } : c
          ),
        }));
      },

      clearCart: () => set({ cartItems: [] }),

      getTotalPrice: () =>
        get().cartItems.reduce((sum, c) => sum + c.price * c.quantity, 0),

      getTotalItems: () =>
        get().cartItems.reduce((sum, c) => sum + c.quantity, 0),
    }),
    {
      name: "cart",
    }
  )
);

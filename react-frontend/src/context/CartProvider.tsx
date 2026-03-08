import React, { useCallback, useState } from "react";
import { CartContext } from "./CartContext";
import type { CartItem } from "../types/models/cart/CartItem";

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on mount
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever items change
  const saveCart = (updatedItems: CartItem[]) => {
    setItems(updatedItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    }
  };

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, quantity: number) => {
    setItems((prevItems) => {
      // Check if item already exists
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);

      let updatedItems: CartItem[];
      if (existingItem) {
        // Update quantity if item exists
        updatedItems = prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        );
      } else {
        // Add new item
        updatedItems = [...prevItems, { ...item, quantity }];
      }

      saveCart(updatedItems);
      return updatedItems;
    });
  }, []);

  const removeFromCart = useCallback((productId: number | string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);
      saveCart(updatedItems);
      return updatedItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: number | string, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const updatedItems = prevItems.filter((item) => item.id !== productId);
        saveCart(updatedItems);
        return updatedItems;
      }

      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCart(updatedItems);
      return updatedItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

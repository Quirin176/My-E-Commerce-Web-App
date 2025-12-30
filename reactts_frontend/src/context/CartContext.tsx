import React, { createContext, useCallback, useState } from "react";
import type { CartItem } from "../types/models/CartItem";
import type { CartContextType } from "../types/context/CartContextType";

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>(() => {
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
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Add new item
        updatedItems = [...prevItems, { ...item, quantity }];
      }

      saveCart(updatedItems);
      return updatedItems;
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);
      saveCart(updatedItems);
      return updatedItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
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
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

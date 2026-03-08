import { createContext } from "react";
import type { CartContextType } from "../context/CartProvider";

export const CartContext = createContext<CartContextType | undefined>(undefined);

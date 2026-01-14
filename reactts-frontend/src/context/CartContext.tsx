import { createContext } from "react";
import type { CartContextType } from "../types/context/CartContextType";

export const CartContext = createContext<CartContextType | undefined>(undefined);

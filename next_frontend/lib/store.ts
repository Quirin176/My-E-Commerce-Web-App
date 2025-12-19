import { create } from 'zustand';
import Cookies from 'js-cookie';
import { User, CartItem, AuthResponse } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  login: (response: AuthResponse) => {
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      phone: response.phone,
      role: response.role as 'Customer' | 'Admin',
      createdAt: response.createdAt,
    };
    Cookies.set('token', response.token, { expires: 7 });
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
    set({ user, token: response.token });
  },
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
    set({ user: null, token: null });
  },
  setUser: (user: User) => set({ user }),
}));

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item: CartItem) => {
    const existing = get().items.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
      existing.totalPrice = existing.quantity * existing.unitPrice;
    } else {
      set((state) => ({ items: [...state.items, item] }));
    }
  },
  removeItem: (productId: number) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),
  updateQuantity: (productId: number, quantity: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              totalPrice: quantity * item.unitPrice,
            }
          : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotalPrice: () =>
    get().items.reduce((sum, item) => sum + item.totalPrice, 0),
  getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));

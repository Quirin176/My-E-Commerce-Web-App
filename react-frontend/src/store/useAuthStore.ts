import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/auth/authApi";
import type { User } from "../types/models/auth/User";
import type { SignupRequest } from "../types/dto/SignupRequest";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupRequest) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            phone: response.phone,
            role: response.role || "user",
            createdAt: response.createdAt,
          };
          // localStorage.setItem("token", response.token);
          set({ user, loading: false });
          return user;
        } catch (err) {
          const error = err instanceof Error ? err.message : "Login failed";
          set({ error, loading: false });
          throw err;
        }
      },

      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.signup(userData);
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            phone: response.phone,
            role: response.role || "user",
            createdAt: response.createdAt,
          };
          // localStorage.setItem("token", response.token);
          set({ user, loading: false });
          return true;
        } catch (err) {
          const error = err instanceof Error ? err.message : "Signup failed";
          set({ error, loading: false });
          throw err;
        }
      },

      logout: async () => {
        // localStorage.removeItem("token");
        // localStorage.removeItem("auth");
        await authApi.logout();
        set({ user: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth",
      // Only persist the user object, not loading/error state
      partialize: (state) => ({ user: state.user }),
    }
  )
);

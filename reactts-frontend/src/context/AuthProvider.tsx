import { useState, useCallback } from "react";
import { authApi } from "../api/auth/authApi";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/models/auth/User";
import type { UserDto } from "../types/dto/UserDto";
import type { SignupRequest } from "../types/dto/SignupRequest";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: {
    username: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(() => {
        // Load user from localStorage on mount
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper function to normalize user data from any response
    const normalizeUserData = (response: UserDto): User => {
        return {
            id: response.id,
            username: response.username,
            email: response.email,
            phone: response.phone,
            role: response.role || "user",
            createdAt: response.createdAt,
            token: response.token,
        };
    };

    {/* LOGIN */}
    const login = useCallback(
        async (email: string, password: string): Promise<User> => {
            setLoading(true);
            setError(null);

            try {
                const response = await authApi.login(email, password);

                const userData = normalizeUserData(response);

                // Store in localStorage
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", userData.token);

                setUser(userData);
                return userData;
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Login failed";
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    {/* SIGNUP */}
    const signup = useCallback(
        async (userData: SignupRequest): Promise<boolean> => {
            setLoading(true);
            setError(null);

            try {
                const response = await authApi.signup(userData);

                // Normalize the response data (handles different response structures)
                const user = normalizeUserData(response);

                // Store in localStorage
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", user.token);

                setUser(user);
                return true;
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Signup failed";
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    {/* LOGOUT */}
    const logout = useCallback(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setError(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

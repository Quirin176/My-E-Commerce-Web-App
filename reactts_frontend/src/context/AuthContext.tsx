import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        console.error("Error parsing user JSON");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // LOGIN FUNCTION
  const login = async ({ email, password }) => {
    try {
      const data = await authApi.login(email, password); 
      
      localStorage.setItem("token", data.token);
      
      const userObj = {
        id: data.id,
        username: data.username,
        email: data.email,
        createdAt: data.createdAt,
        role: data.role,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  // SIGNUP FUNCTION
  const signup = async (userData) => {
    try {
      const data = await authApi.signup(userData);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
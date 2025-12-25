import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/home/Home";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Auth from "./pages/auth/Auth";
import Profile from "./pages/user/Profile";
// import Orders from "./pages/user/Orders";
// import OrderDetail from "./pages/user/OrderDetail";

// // Context
import { useAuth } from "./hooks/useAuth";

// Protected Route Component
function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />; 
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* User Account Pages */}
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        {/* <Route path="/orders" element={<Protected><Orders /></Protected>} />
        <Route path="/order/:orderId" element={<Protected><OrderDetail /></Protected>} /> */}
      </Route>

      {/* Auth pages use AuthLayout (no nav/footer) */}
      <Route path="/auth" element={<Auth />} >
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
      
    </Routes>
  );
}

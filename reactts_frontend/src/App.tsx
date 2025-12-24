import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/home/Home";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Auth from "./pages/auth/Auth";

// // Context
// import { useAuth } from "./context/AuthContext";

// // Protected Route Component
// function Protected({ children }) {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/auth/login" replace />; 
// }

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
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

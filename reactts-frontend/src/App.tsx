import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/home/Home";
import CategoryProducts from "./pages/category/Category";
import ProductDetail from "./pages/productdetail/ProductDetail";

import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

import About from "./pages/about/About";
import Cart from "./pages/user/Cart"

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Auth from "./pages/auth/Auth";
import Profile from "./pages/user/Profile";
// import Orders from "./pages/user/Orders";
// import OrderDetail from "./pages/user/OrderDetail";

import Test from "./pages/test/Test";

// // Context
import { useAuth } from "./hooks/useAuth";


// Protected Route Component
interface ProtectedProps {
  children: React.ReactNode;
}

// Protected Route Component
function Protected({ children }: ProtectedProps) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />; 
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/category/:slug" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />

        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />

        {/* User Account Pages */}
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        {/* <Route path="/orders" element={<Protected><Orders /></Protected>} />
        <Route path="/order/:orderId" element={<Protected><OrderDetail /></Protected>} /> */}
        {/* <Route path="/checkout" element={<Protected><Checkout /></Protected>} /> */}
      </Route>

      {/* Auth pages use AuthLayout (no nav/footer) */}
      <Route path="/auth" element={<Auth />} >
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
      
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

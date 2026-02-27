import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import Orders from "./pages/user/UserOrders";
import OrderDetail from "./pages/user/OrderDetail";
import Checkout from "./pages/user/Checkout";

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
  return user ? children : <Navigate to="/home" replace />;
}

function AdminProtected({ children }: ProtectedProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth?mode=login" replace />;
  if (user.role !== "Admin") return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            textAlign: "center",
          },
        }}
        containerStyle={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      <Routes>
        <Route element={<MainLayout />}>
          {/* Customer Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/category/:selectedCategory" element={<CategoryProducts />} /> // Use selectedCategory param to fetch products
          <Route path="/product/:slug" element={<ProductDetail />} /> // Use slug param to fetch product details

          {/* Admin Pages */}
          <Route path="/admin/products" element={<AdminProtected><AdminProducts /></AdminProtected>} />
          <Route path="/admin/orders" element={<AdminProtected><AdminOrders /></AdminProtected>} />

          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />

          {/* User Account Pages */}
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/orders" element={<Protected><Orders /></Protected>} />
          <Route path="/order/:orderId" element={<Protected><OrderDetail /></Protected>} /> // Use orderId param to fetch order details
          <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
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
    </>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/home/Home";
// import Categories from "./pages/categories/Categories";
import About from "./pages/about/About";
import Cart from "./pages/cart/Cart";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import { useAuth } from "./context/AuthContext";

import CategoryProducts from "./pages/categories/categoryProducts/CategoryProducts";
import ProductDetails from "./pages/productdetails/ProductDetails";

import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductNew from "./pages/admin/AdminProductNew";
import AdminProductEdit from "./pages/admin/AdminProductEdit";

import Profile from "./pages/user/Profile";
import Orders from "./pages/user/Orders";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth/login" replace />; }

export default function App(){
  return (
    <Routes>
      {/* Public site pages using AppLayout */}
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/category/:slug" element={<CategoryProducts />} />
        {/* <Route path="/categories" element={<Categories />} /> */}
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AdminProductNew />} />
        <Route path="/admin/products/:id" element={<AdminProductEdit />} />

      </Route>
      
      {/* Auth pages use AuthLayout (no nav) */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      );
    }

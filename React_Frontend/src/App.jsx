import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

// Public Pages
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Search from "./pages/search/Search";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Category & Product Pages
import CategoryProducts from "./pages/categories/categoryProducts/CategoryProducts";
import ProductDetails from "./pages/productdetails/ProductDetails";

// User Pages
import Profile from "./pages/user/Profile";
import Orders from "./pages/user/Orders";
import OrderDetail from "./pages/user/OrderDetail";

// Admin Pages
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductNew from "./pages/admin/AdminProductNew";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminOrders from "./pages/admin/AdminOrders";

// Context
import { useAuth } from "./context/AuthContext";

// Protected Route Component
function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth/login" replace />; 
}

export default function App(){
  return (
    <Routes>
      {/* Public site pages using AppLayout */}
      <Route element={<AppLayout />}>
        {/* Home & Browse */}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/category/:slug" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        
        {/* Info Pages */}
        <Route path="/about" element={<About />} />
        
        {/* Shopping Cart & Checkout */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
        
        {/* User Account Pages */}
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/orders" element={<Protected><Orders /></Protected>} />
        <Route path="/order/:orderId" element={<Protected><OrderDetail /></Protected>} />
        
        {/* Admin Pages */}
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AdminProductNew />} />
        <Route path="/admin/products/:id" element={<AdminProductEdit />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Route>
      
      {/* Auth pages use AuthLayout (no nav/footer) */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

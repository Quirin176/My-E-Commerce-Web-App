import { useAuth } from "../../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, Package, ShoppingCart, ListTree, LogOut } from "lucide-react";
import { siteConfig } from "../../../config/siteConfig";

const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, to: "/admin/home" },
    { label: "Products", icon: <Package size={20} />, to: "/admin/products" },
    { label: "Attributes", icon: <ListTree size={20} />, to: "/admin/attributes" },
    { label: "Orders", icon: <ShoppingCart size={20} />, to: "/admin/orders" },
];

export default function AdminSidePanel() {
    const { user, logout } = useAuth();
    return (
        <div
            className="group text-white h-screen fixed left-0 top-16 flex flex-col transition-all duration-300 w-16 hover:w-56 overflow-hidden z-40 rounded-r-3xl"
            style={{ background: siteConfig.colors.primarycolor }}
        >
            {/* MENU */}
            <nav className="flex-1 flex flex-col mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) => `flex items-center gap-3 p-4 font-bold hover:text-black hover:bg-white transition-all duration-300 ${isActive ? "text-black bg-white" : ""}`}
                    >
                        <span>{item.icon}</span>
                        <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-300">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* USER + LOGOUT (BOTTOM SECTION) */}
            <div className="p-4 border-t border-white/30">
                {/* USER INFO */}
                <div className="flex items-center gap-3 mb-3">
                    {/* Avatar (Initial Letter) */}
                    <div className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>

                    {/* Username (visible on expand) */}
                    <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-300 font-semibold">
                        {user?.username || "User"}
                    </span>
                </div>

                {/* LOGOUT BUTTON */}
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full p-3 font-bold text-white hover:bg-red-500 transition-all duration-300 rounded"
                >
                    <LogOut size={20} />
                    <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-300">
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
}

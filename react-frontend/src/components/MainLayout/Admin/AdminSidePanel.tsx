import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, Package, ShoppingCart, ListTree, LogOut } from "lucide-react";

export default function AdminSidePanel() {
    return (
        <div
            className="group bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 w-16 hover:w-56 overflow-hidden z-50"
        >
            {/* LOGO */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-700">
                <img src="/react.svg" className="w-8 h-8" alt="Logo" />
                <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-300">
                    Admin Panel
                </span>
            </div>

            {/* MENU */}
            <nav className="flex-1 flex flex-col mt-4">
                {menuItems.map((item) => (
                    <SidebarItem key={item.label} {...item} />
                ))}
            </nav>
        </div>
    );
}

const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, to: "/admin/home" },
    { label: "Products", icon: <Package size={20} />, to: "/admin/products" },
    { label: "Attributes", icon: <ListTree size={20} />, to: "/admin/attributes" },
    { label: "Orders", icon: <ShoppingCart size={20} />, to: "/admin/orders" },
];

function SidebarItem({ label, icon, to }: { label: string; icon: React.ReactNode; to: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-all duration-300 ${isActive ? "bg-gray-800" : ""}`}
        >
            <span>{icon}</span>
            <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-300">
                {label}
            </span>
        </NavLink>
    );
}
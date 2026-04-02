import { useAuth } from "../../../hooks/useAuth";
import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Handbag, FilePlus, Layers, LogOut, User2 } from "lucide-react";
import { siteConfig } from "../../../config/siteConfig";
import reactLogo from "../../../assets/react.svg";

const menuItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, to: "/admin/dashboard" },
    { label: "Products", icon: <FilePlus size={20} />, to: "/admin/products" },
    { label: "Categories & Attributes", icon: <Layers size={20} />, to: "/admin/attributes" },
    { label: "Orders", icon: <Handbag size={20} />, to: "/admin/orders" },
    { label: "Users", icon: <User2 size={20} />, to: "/admin/users" },
];

export default function AdminSidePanel() {
    const { logout } = useAuth();
    return (
        <div
            className="group text-white fixed flex flex-col transition-all duration-300 h-full overflow-hidden z-40 rounded-br"
            style={{ background: siteConfig.colors.primarycolor }}
        >
            {/* LOGO AND SITE NAME */}
            <Link to="/admin/dashboard" className="flex items-center gap-2 text-white text-2xl font-bold h-12 px-4 py-2">
                <img src={reactLogo} alt="logo" className="w-8 h-8" />
                {siteConfig.webName}
            </Link>

            {/* MENU */}
            <nav className="flex-1 flex flex-col mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) => `flex items-center gap-3 p-4 font-bold hover:text-black hover:bg-white transition-all duration-300 ${isActive ? "text-black bg-white" : ""}`}
                    >
                        <span>{item.icon}</span>
                        <span className="whitespace-nowrap transition-all duration-300">
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* LOGOUT BUTTON */}
            <button
                onClick={logout}
                className="flex items-center gap-3 p-4 w-full h-16 font-bold text-white hover:bg-red-500 transition-all duration-300 rounded"
            >
                <LogOut size={20} />
                <span className="whitespace-nowrap transition-all duration-300">
                    Logout
                </span>
            </button>
        </div>
    );
}

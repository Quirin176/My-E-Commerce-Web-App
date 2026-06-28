import { Link, useLocation } from "react-router-dom";
import { BellRing, MessageCircleMore, Settings } from "lucide-react";
import { useAuth } from "../../../hooks/auth/useAuth";
import AdminDropDown from "./AdminDropDown";
import ThemeToggle from "../../ThemeToggle";

const navigationItems = [
    { label: "Chats", icon: <MessageCircleMore size={20} />, to: "/admin/chats" },
    { label: "Alarm", icon: <BellRing size={20} />, to: "/admin/alarms" },
    { label: "Settings", icon: <Settings size={20} />, to: "/admin/settings" },
];

export default function AdminHeader() {
    const { user } = useAuth();

    const location = useLocation();
    const getSegment = () => {
        const segments = location.pathname.split('/').filter(Boolean);
        const index = segments.indexOf('admin');
        const result = segments[index + 1];

        if (!result) return "Not Found";
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    return (
        <header
            className="fixed top-0 left-60 pl-8 pr-68 py-2 w-full h-18 z-50
            flex flex-col sm:flex-row items-center gap-2 sm:justify-between
            shadow-lg bg-linear-to-br from-(--brand-primary) to-(--brand-secondary)"
        >
            <h1 className="text-2xl text-white font-bold">{getSegment()}</h1>

            <div className="flex items-center justify-end w-full gap-6">
                <ThemeToggle />

                <div className="flex items-center gap-6">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            title={item.label}
                            className="font-semibold text-white hover:underline"
                        >
                            {item.icon}
                        </Link>
                    ))}
                </div>

                {/* USER */}
                {user && (
                    <div className="flex items-center gap-3">
                        <AdminDropDown />
                    </div>)}
            </div>
        </header>
    );
};

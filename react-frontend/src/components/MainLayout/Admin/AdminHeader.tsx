import { Link, useLocation } from "react-router-dom";
import { BellRing, Settings } from "lucide-react";
import { siteConfig } from "../../../config/siteConfig";
import { useAuth } from "../../../hooks/auth/useAuth";
import AdminDropDown from "./Admin/AdminDropDown";

const navigationItems = [
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
            className="h-16 flex items-center px-8"
            style={{ backgroundColor: siteConfig.colors.primarycolor }}
        >
            <h1 className="text-2xl text-white font-bold">{getSegment()}</h1>

            <div className="flex items-center justify-end w-full gap-6">
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

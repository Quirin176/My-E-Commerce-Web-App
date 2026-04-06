import { Link } from "react-router-dom";
import { BellRing, Settings } from "lucide-react";
import { siteConfig } from "../../../config/siteConfig";
import { useAuth } from "../../../hooks/users/useAuth";
import AdminDropDown from "./Admin/AdminDropDown";

const navigationItems = [
    { label: "Alarm", icon: <BellRing size={20} />, to: "/admin/alarms" },
    { label: "Settings", icon: <Settings size={20} />, to: "/admin/settings" },
];

export default function AdminHeader() {
    const { user } = useAuth();

    return (
        <header
            className="h-16 flex items-center shadow-md px-8"
            style={{ backgroundColor: siteConfig.colors.primarycolor }}
        >
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

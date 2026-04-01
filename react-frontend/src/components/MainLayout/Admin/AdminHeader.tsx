import { Link } from "react-router-dom";
import { siteConfig } from "../../../config/siteConfig";
import { useAuth } from "../../../hooks/useAuth";
import UserDropDown from "../../User/UserDropDown";
import reactLogo from "../../../assets/react.svg";

export default function AdminHeader() {
    const { user } = useAuth();

    return (
        <header
            className="fixed top-0 left-0 w-full z-50 shadow-md px-8"
            style={{ backgroundColor: siteConfig.colors.primarycolor }}
        >
            <div className="px-4 py-2">
                <div className="flex items-center justify-between">

                    {/* LOGO AND SITE NAME */}
                    <Link to="/admin/home" className="flex items-center gap-2 text-white text-2xl font-bold">
                        <img src={reactLogo} alt="logo" className="w-8 h-8" />
                        {siteConfig.webName}
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/admin/products"
                            className="font-semibold text-white">
                            Products
                        </Link>
                        <Link
                            to="/admin/orders"
                            className="font-semibold text-white">
                            Orders
                        </Link>
                        <Link
                            to="/admin/attributes"
                            className="font-semibold text-white">
                            Attributes
                        </Link>
                    </div>

                    {/* USER */}
                    {!user && (
                        <div className="flex items-center">
                            <Link
                                to="/auth?mode=login"
                                className="font-semibold text-white hover:underline px-4 py-1"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/auth?mode=signup"
                                className="font-semibold text-white hover:underline px-4 py-1"
                            >
                                Register
                            </Link>
                        </div>)}

                    {user && (
                        <div className="flex items-center gap-3">
                            <UserDropDown />
                        </div>)}
                </div>
            </div>
        </header>
    );
};

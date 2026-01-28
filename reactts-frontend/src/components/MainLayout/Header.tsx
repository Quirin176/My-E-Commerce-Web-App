import { Link } from "react-router";
import { Search } from "lucide-react";
import { searchApi } from "../../api/products/searchApi";
import { siteConfig } from "../../config/siteConfig";
import { useAuth } from "../../hooks/useAuth";
import UserDropDown from "../User/UserDropDown";
import CategoriesDropdown from "./CategoriesDropdown";

const colors = siteConfig.colors;
export default function Header() {
  const { user } = useAuth();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 shadow-md px-8"
      style={{ backgroundColor: colors.primarycolor }}
    >
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">

          {/* LOGO AND SITE NAME */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="text-white text-2xl font-bold">
              {siteConfig.webName}
            </Link>

            <CategoriesDropdown />
          </div>

          {/* SEARCH BAR */}
          <div className="bg-white rounded-2xl pl-4 pr-2">
            <div className="flex gap-4 py-2 items-center">
              <input
                className="text-lg"
                style={{ width: 500 }}
                type="text"
                placeholder="Search For Products"
              />
              <button
                className="px-4 py-2 rounded-2xl text-white hover:text-gray-600 cursor-pointer"
                style={{ background: colors.primarycolor }}
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          {user?.role === "Admin" && (
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
            </div>
          )}
          {user?.role !== "Admin" && (
            <div className="flex items-center gap-6">
              <Link
                to="/about"
                className="font-semibold text-white">
                About us
              </Link>
              <Link
                to="/cart"
                className="font-semibold text-white">
                Cart
              </Link>
            </div>
          )}

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

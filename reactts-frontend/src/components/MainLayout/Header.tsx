import { Link } from "react-router";
import { siteConfig } from "../../config/siteConfig";
import {useAuth} from "../../hooks/useAuth";
import UserDropDown from "../User/UserDropDown";
import CategoriesDropdown from "./CategoriesDropdown";

const colors = siteConfig.colors;
export default function Header() {
  const { user } = useAuth();

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 shadow-md px-8 py-1"
      style={{ backgroundColor: colors.primarycolor }}
    >
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">

          {/* LOGO AND SITE NAME */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="text-white text-2xl font-bold">
              {siteConfig.webName}
            </Link>

            <CategoriesDropdown/>
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
            className="font-semibold text-white hover:text-black hover:bg-white rounded-0 border px-4 py-1"
            >
              Login
            </Link>
            <Link
            to="/auth?mode=signup"
            className="font-semibold text-white hover:text-black hover:bg-white rounded-0 border px-4 py-1"
            >
              Signup
            </Link>
          </div>)}

          {user && (
          <div className="flex items-center gap-3">
            <UserDropDown/>
          </div>)}
        </div>
      </div>
    </header>
  );
};

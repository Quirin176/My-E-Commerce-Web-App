import { Link } from "react-router-dom";
import { UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CategoriesDropdown from "./dropdown/CategoriesDropdown";
import UserDropdown from "./dropdown/UserDropdown";
import { siteConfig } from "../config/siteConfig";

export default function Header() {
  const { user } = useAuth();
  const colors = siteConfig.colors;

  return (
    <header className="shadow" style={{ backgroundColor: colors.headerBg }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* LEFT SIDE */}
        <div className="flex items-center space-x-32">
          <div className="flex items-center space-x-8">
            <Link to="/" className="font-bold text-2xl text-white">
              {siteConfig.webName}
            </Link>

            <CategoriesDropdown
              categories={siteConfig.categories}
              textColor={colors.categoryTextColor}
              listhoverBg={colors.categorylistHoverBg}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-4">

          {/* CUSTOMER RIGHT SIDE PANEL */}
          {user?.role === "Customer" && (
            <nav className="space-x-8">
              {siteConfig.usermenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="text-lg text-white font-semibold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* ADMIN RIGHT SIDE PANEL */}
          {user?.role === "Admin" && (
            <div className="flex items-center space-x-8">
              <a
                href="/admin/products"
                className="text-lg text-white font-semibold"
              >
                Admin Panel
              </a>
            </div>
          )}

          {/* USER IS LOGGED OUT */}
          {!user && (
            <div className="flex items-center">
              <Link
                to="/auth/login"
                className="ml-4 px-3 py-1 bg-gray-200 border rounded font-bold flex items-center space-x-1"
              >
                <UserRound className="h-7 w-7 text-black" />
                <span>Login</span>
              </Link>

              <Link
                to="/auth/signup"
                className="ml-2 px-3 py-1 bg-yellow-600 text-white rounded font-bold"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* USER IS LOGGED IN */}
          {user && (
            <div className="flex items-center">
              <UserRound className="h-7 w-7 text-white" />
              <UserDropdown>
                textColor={colors.categoryTextColor}
                listhoverBg={colors.categorylistHoverBg}
              </UserDropdown>
            </div>
          )}
          
        </div>
      </div>
    </header>
  );
}

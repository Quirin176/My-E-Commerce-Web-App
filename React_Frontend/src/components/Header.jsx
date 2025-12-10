import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CategoriesDropdown from "./dropdown/CategoriesDropdown";
import UserDropdown from "./dropdown/UserDropdown";
import { siteConfig } from "../config/siteConfig";

export default function Header() {
  const { user } = useAuth();
  const colors = siteConfig.colors;
  const UserIcon = ({ className = "h-6 w-6" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.121 17.804A8.966 8.966 0 0112 15c2.348 0 4.545.856 6.879 2.804M15 12a3 3 0 11-6 0 3 3 0 016 0zM12 21a9 9 0 100-18 9 9 0 000 18z"
      />
    </svg>
  );

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
                <UserIcon className="h-5 w-5 text-black" />
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
              <UserIcon className="h-5 w-5 text-white" />
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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { siteConfig } from "../../../config/siteConfig";
import { useAuth } from "../../../hooks/useAuth";
import UserDropDown from "./User/UserDropDown";
import CategoriesDropdown from "./CategoriesDropdown";

export default function CustomerHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <header
      className="w-full z-50 shadow-md px-8 py-2"
      style={{ backgroundColor: siteConfig.colors.primarycolor }}
    >
      <div className="flex items-center justify-between">

        {/* LOGO AND SITE NAME */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="text-white text-2xl font-bold">
            {siteConfig.webName}
          </Link>

          <CategoriesDropdown />
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white rounded-4xl pl-4 pr-2">
          <div className="flex gap-4 py-2 items-center">
            <Search size={20} />
            <input
              className="text-lg"
              style={{ width: 500 }}
              type="text"
              placeholder="Search For Products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearchSubmit}
              className="px-4 py-2 rounded-4xl text-white hover:text-gray-600 cursor-pointer"
              style={{ background: siteConfig.colors.primarycolor }}
            >
              Search
            </button>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
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
    </header>
  );
};

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";
import { productApi } from "../../../api/products/productApi";
import UserDropDown from "./UserDropDown";
import CategoriesDropdown from "../../products/CategoriesDropdown";
import SearchBar from "../../SearchBar";
import ThemeToggle from "../../ThemeToggle";
import { siteConfig } from "../../../config/siteConfig";

export default function CustomerHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSuggest = async (query: string) => {
    const sugs = await productApi.getSuggestions(query, 10);
    setSuggestions(sugs);
  }

  const handleSearchSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full z-50 shadow-md px-8 py-2 bg-(--brand-primary)">
      <div className="flex items-center justify-between">

        {/* LOGO AND SITE NAME */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="text-white text-2xl font-bold">
            {siteConfig.webName}
          </Link>

          <CategoriesDropdown />
        </div>

        {/* SEARCH BAR */}
        <SearchBar onSuggest={(searchQuery) => handleSuggest(searchQuery)} suggestions={suggestions} onSearchSubmit={(searchQuery) => handleSearchSubmit(searchQuery)} />

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-6">
          <Link
            to="/about"
            className="font-semibold text-white">
            About us
          </Link>
        </div>

        <div className="flex flex-row items-center gap-4">
          <ThemeToggle />

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
            <div className="flex items-center px-12">
              <UserDropDown />
            </div>)}
        </div>
      </div>
    </header>
  );
};

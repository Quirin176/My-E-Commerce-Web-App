import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";
import { productApi } from "../../../api/products/productApi";
import UserDropDown from "./UserDropDown";
import CategoriesDropdown from "../../products/CategoriesDropdown";
import SearchBar from "../../SearchBar";
import ThemeToggle from "../../ThemeToggle";
import reactLogo from "../../../assets/react.svg";
import { siteConfig } from "../../../config/siteConfig";

export default function CustomerHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSuggest = async (searchQuery: string) => {
    const sugs = await productApi.getSuggestions(searchQuery, 10);
    setSuggestions(sugs);
  }

  const handleSearchSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-18 z-50
    flex flex-col sm:flex-row items-center gap-2 sm:justify-between
    shadow-lg px-4 py-2 bg-linear-to-br from-(--brand-primary) to-(--brand-secondary)">
      {/* LOGO AND SITE NAME */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <Link to="/" className="flex items-center gap-2 text-white text-2xl font-bold">
          <img src={reactLogo} alt="logo" className="w-8 h-8" />
          {siteConfig.webName}
        </Link>

        <CategoriesDropdown />
      </div>

      {/* SEARCH BAR */}
      <div className="w-full sm:flex-1 sm:flex sm:justify-center">
        <SearchBar
          onSuggest={(searchQuery) => handleSuggest(searchQuery)}
          suggestions={suggestions}
          onSearchSubmit={(searchQuery) => handleSearchSubmit(searchQuery)} />
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
      
    </header>
  );
};

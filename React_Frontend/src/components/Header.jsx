// Update: src/components/Header.jsx
// Replace the search section with this enhanced version

import { Link, useNavigate } from "react-router-dom";
import { UserRound, Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import CategoriesDropdown from "./dropdown/CategoriesDropdown";
import UserDropdown from "./dropdown/UserDropdown";
import { siteConfig } from "../config/siteConfig";
import { searchApi } from "../api/searchApi";

export default function Header() {
  const { user } = useAuth();
  const colors = siteConfig.colors;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setLoadingSuggestions(true);
      try {
        const results = await searchApi.getSuggestions(searchQuery, 8);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Suggestions error:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e, query = searchQuery) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <header className="shadow" style={{ backgroundColor: colors.headerBg }}>
      <div className="container mx-auto px-4 py-4">
        {/* Top Row: Logo, Categories, and Right Side */}
        <div className="flex justify-between items-center mb-4">
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
            
        {/* Search Bar Row with Suggestions */}
        <div className="flex justify-center">
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl relative"
            ref={suggestionsRef}
          >
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                className="w-full px-4 py-2.5 pl-4 pr-12 rounded-lg border-2 border-transparent focus:outline-none focus:border-blue-400 transition text-gray-800 placeholder-gray-500"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-12 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}

              {/* Search button */}
              <button
                type="submit"
                className="absolute right-2 text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-md transition"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {loadingSuggestions ? (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      Loading suggestions...
                    </div>
                  ) : (
                    <div className="py-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-gray-800 text-sm flex items-center gap-2"
                        >
                          <Search size={16} className="text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* No suggestions found */}
              {showSuggestions && 
                !loadingSuggestions && 
                searchQuery && 
                suggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-3 text-center text-gray-500 text-sm">
                  No products found. Press Enter to search.
                </div>
              )}
            </div>
          </form>
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
      </div>
    </header>
  );
}
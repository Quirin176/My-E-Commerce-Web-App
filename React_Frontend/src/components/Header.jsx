import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, UserRound, X } from "lucide-react";
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
  <header
    className="shadow-md"
    style={{ backgroundColor: colors.headerBg }}
  >
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center justify-between gap-6">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-6 shrink-0">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-white hover:opacity-90 transition"
          >
            {siteConfig.webName}
          </Link>

          <CategoriesDropdown
            categories={siteConfig.categories}
            textColor={colors.categoryTextColor}
            listhoverBg={colors.categorylistHoverBg}
          />
        </div>

        {/* ================= CENTER (SEARCH) ================= */}
        <div className="flex-1 max-w-2xl">
          <form
            onSubmit={handleSearch}
            className="relative"
            ref={suggestionsRef}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSuggestions(true)}
              className="
                w-full rounded-xl px-4 py-2.5 pr-12
                text-gray-800 placeholder-gray-400
                shadow-sm border border-transparent
                focus:outline-none focus:border-blue-500
                transition
              "
            />

            {/* Clear */}
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}

            {/* Search */}
            <button
              type="submit"
              className="
                absolute right-2 top-1/2 -translate-y-1/2
                bg-blue-600 hover:bg-blue-700
                p-2 rounded-lg text-white transition
              "
            >
              <Search size={18} />
            </button>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border max-h-64 overflow-y-auto">
                {loadingSuggestions ? (
                  <div className="p-3 text-center text-sm text-gray-500">
                    Loading suggestions...
                  </div>
                ) : (
                  suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSuggestionClick(s)}
                      className="
                        w-full flex items-center gap-2 px-4 py-2.5
                        text-sm text-gray-700
                        hover:bg-blue-50 transition
                      "
                    >
                      <Search size={14} className="text-gray-400" />
                      {s}
                    </button>
                  ))
                )}
              </div>
            )}

            {showSuggestions &&
              !loadingSuggestions &&
              searchQuery &&
              suggestions.length === 0 && (
                <div className="absolute z-50 mt-2 w-full rounded-xl bg-white shadow-lg border p-3 text-center text-sm text-gray-500">
                  No products found. Press Enter to search.
                </div>
              )}
          </form>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-6 shrink-0">

          {/* CUSTOMER */}
          {user?.role === "Customer" && (
            <nav className="flex items-center gap-6 text-white font-semibold">
              <Link to="/customer-service" className="hover:opacity-80">
                Customer Service
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-1 hover:opacity-80"
              >
                <ShoppingCart className="h-5 w-5" />
                Cart
              </Link>
            </nav>
          )}

          {/* ADMIN */}
          {user?.role === "Admin" && (
            <nav className="flex items-center gap-6 text-white font-semibold">
              <a href="/admin/products" className="hover:opacity-80">
                Products
              </a>
              <a href="/admin/orders" className="hover:opacity-80">
                Orders
              </a>
            </nav>
          )}

          {/* LOGGED OUT */}
          {!user && (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="
                  flex items-center gap-1
                  bg-white text-black
                  px-3 py-1.5 rounded-lg font-semibold
                  hover:bg-gray-100 transition
                "
              >
                <UserRound className="h-5 w-5" />
                Login
              </Link>

              <Link
                to="/auth/signup"
                className="
                  bg-yellow-600 hover:bg-yellow-700
                  text-white px-3 py-1.5 rounded-lg font-semibold transition
                "
              >
                Sign up
              </Link>
            </div>
          )}

          {/* LOGGED IN */}
          {user && (
            <div className="flex items-center">
              <UserRound className="h-6 w-6 text-white" />
              <UserDropdown
                textColor={colors.categoryTextColor}
                listhoverBg={colors.categorylistHoverBg}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
);
}

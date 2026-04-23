import { useState } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../../hooks/products/useCategories";
import { useProductFiltersBySlug } from "../../../hooks/products/useProductFiltersBySlug";

import { siteConfig } from "../../../config/siteConfig";
import { categoriesIcon } from "../../../config/siteConfig";
import CategoryFiltersPanel from "../Home/CategoryFiltersPanel";
import CategoryPanel from "../Home/CategoryPanel";

export default function CategoriesDropdown() {
  const colors = siteConfig.colors;
  const [open, setOpen] = useState(false);
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const { filters, filtersLoading, loadFilters } = useProductFiltersBySlug();

  // Get icon component from category
  const handleHover = async (slug: string) => {
    await loadFilters(slug);
    setSelectedCategory(slug);
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(null);
    navigate(`/category/${slug}`);
  };

  // Handle filter click - navigate with filter applied
  const handleFilterClick = (categoryLink: string, optionValueId: string | number) => {
    setOpen(false);
    navigate(`/category/${encodeURIComponent(categoryLink)}?category=${encodeURIComponent(categoryLink)}&selectedOptions=${optionValueId}`);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const handleLeave = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="relative inline-block font-semibold">
      <button
        className="flex items-center gap-2 px-4 py-2 border-2 rounded-4xl font-semibold hover:shadow-md transition cursor-pointer"
        style={{ color: "White" }}
        onClick={() => setOpen(!open)}
      >
        <LayoutGrid size={18} />
        <span className="text-base pr-20">All Categories</span>
        <ChevronDown size={18} className={`${open ? "rotate-180" : ""} transition`} />
      </button>

      {/* DARK OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={handleClose}
        />
      )}

      {/* DROPDOWN PANEL - HORIZONTALLY CENTERED, VERTICALLY CENTERED ON PAGE */}
      {open && (
        <div
          className="w-375 h-175 fixed left-1/2 transform -translate-x-1/2 bg-white border-0 rounded-xl shadow-2xl z-50 flex overflow-hidden"
          onMouseLeave={handleClose}
        >
          {/* LEFT SIDE: CATEGORIES LIST */}
          <div className={`${selectedCategory ? "w-1/5" : "w-full"} border-r border-gray-200 overflow-y-auto bg-white transition-all duration-300`}>
            <div
              className="sticky bg-linear-to-b text-white pl-4 py-2"
              style={{ background: colors.primarycolor }}
            >
              <h3 className="text-lg font-bold">Categories</h3>
            </div>

            <CategoryPanel
              categories={categories}
              selectedCategory={selectedCategory}
              onHover={handleHover}
              onClick={handleCategoryClick}
            />
          </div>

          {/* RIGHT SIDE: FILTERS FOR SELECTED CATEGORY */}
          {selectedCategory && (
            <div className="w-4/5 overflow-y-auto bg-white">

              {/* HEADER */}
              <div
                className="sticky bg-linear-to-r border-b border-gray-200 pl-4 py-2"
                style={{ background: colors.primarycolor }}
              >
                <p className="text-lg font-bold text-white">Filters</p>
              </div>

              {/* CONTENT */}
              <CategoryFiltersPanel
                selectedCategory={selectedCategory}
                filters={filters}
                loading={filtersLoading}
                onLeave={handleLeave}
                onFilterClick={handleFilterClick}
                onViewAll={() => handleCategoryClick(selectedCategory)}
              />
            </div>)}
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCategories } from "../../hooks/products/useCategories";
import { useProductFiltersBySlug } from "../../hooks/products/useProductFiltersBySlug";

import { siteConfig } from "../../config/siteConfig";
import CategoryPanel from "../../components/MainLayout/Home/CategoryPanel.tsx";
import CategoryFiltersPanel from "../../components/MainLayout/Home/CategoryFiltersPanel.tsx";
import CenterPanel from "../../components/MainLayout/Home/CenterPanel.tsx";
import CategoryTabs from "../../components/MainLayout/Customer/Product/CategoryTabs.tsx";

export default function Home() {
  const colors = siteConfig.colors;

  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const { filters, filtersLoading, loadFilters } = useProductFiltersBySlug();

  // Load filters when category is hovered
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
    navigate(`/category/${encodeURIComponent(categoryLink)}?category=${encodeURIComponent(categoryLink)}&selectedOptions=${optionValueId}`);
  };

  const handleLeave = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="w-full h-125 flex gap-4">

        {/* LEFT SIDE: CATEGORIES PANEL */}
        <div className="w-1/6 h-full rounded-2xl border-2 border-gray-200 bg-white">
          <CategoryPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onHover={handleHover}
            onClick={handleCategoryClick}
          />
        </div>

        {/* CENTER SIDE: DYNAMIC FILTER PANEL OR MAIN PANEL */}
        <div className="flex-1 overflow-y-auto rounded-2xl border-2 border-gray-200 bg-white">
          {selectedCategory ? (
            <CategoryFiltersPanel
              selectedCategory={selectedCategory}
              filters={filters}
              loading={filtersLoading}
              onLeave={handleLeave}
              onFilterClick={handleFilterClick}
              onViewAll={() => handleCategoryClick(selectedCategory)}
            />
          ) : (
            // Main Center Panel
            <CenterPanel />
          )}
        </div>

        {/* RIGHT PANEL FOR ADVERTISING*/}
        <div className="w-1/6 bg-gray-100 border-2 border-gray-200 overflow-y-auto rounded-2xl">
          <div className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">Special Offer!</h3>
              <p className="text-gray-700 mb-6">Get 20% off on your first purchase. Use code: WELCOME20</p>
              <img
                src="https://via.placeholder.com/200x150.png?text=Ad+Banner"
                alt="Advertisement Banner"
                className="mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS SECTION BELOW */}
      <section className="w-full py-6 bg-white rounded-2xl border-2 border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl font-bold mb-6 text-center"
            style={{ color: colors.primarycolor }}
          >
            Featured Products
          </h2>
          <CategoryTabs />
        </div>
      </section>
    </div>
  );
};

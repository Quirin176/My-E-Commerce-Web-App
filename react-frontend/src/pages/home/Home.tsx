import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCategories } from "../../hooks/products/useCategories";
import { useProductFiltersBySlug } from "../../hooks/products/useProductFiltersBySlug";

import CategoryPanel from "../../components/home/CategoryPanel.tsx";
import CategoryFiltersPanel from "../../components/home/CategoryFiltersPanel.tsx";
import CenterPanel from "../../components/home/CenterPanel.tsx";
// import CategoryTabs from "../../components/products/CategoryTabs.tsx";
import CategoryTabs from "../../components/home/categoryTabs/CategoryTabs.tsx";
import { productApi } from "../../api/products/productApi";
import CategorySection from "../../components/home/categorySection/CategorySection.tsx";
import CouponSection from "../../components/home/couponSection/CouponSection.tsx";

export default function Home() {
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
    <div className="flex flex-col items-center rounded-2xl w-full gap-4 bg-(--bg-muted)">
      <section className="w-full h-125 flex gap-4">

        {/* LEFT SIDE: CATEGORIES PANEL */}
        <div className="w-1/6 h-full rounded-2xl border-2 text-(--text-secondary) border-(--border) bg-(--bg-surface)">
          <CategoryPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onHover={handleHover}
            onClick={handleCategoryClick}
          />
        </div>

        {/* CENTER SIDE: DYNAMIC FILTER PANEL OR MAIN PANEL */}
        <div className="flex-1 overflow-y-auto rounded-2xl border-2 text-(--text-primary) border-(--border) bg-(--bg-surface)">
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
        <div className="w-1/6 overflow-y-auto rounded-2xl border-2 text-(--text-secondary) border-(--border) bg-(--bg-surface)">
          <div className="p-4">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4">Special Offer!</h3>
              <p className="text-gray-700 mb-6">Get 20% off on your first purchase. Use code: WELCOME20</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <CategorySection categories={categories} />
      </section>

      {/* CATEGORY TABS SECTION */}
      {/* <section className="w-full">
        <CategoryTabs />
      </section> */}
      <section className="w-full">
        <CategoryTabs
          title="Newest Arrivals"
          fetchProducts={async (categoryId, limit) => {
            const res =
              await productApi.getCategoryNewestProducts(
                categoryId,
                limit
              );

            return res.data.products;
          }}
          productsPerPage={5}
          numberOfTabs={4}
        />
      </section>

      {/* COUPON SECTION */}
      <section className="w-full">
        <CouponSection />
      </section>
    </div>
  );
};
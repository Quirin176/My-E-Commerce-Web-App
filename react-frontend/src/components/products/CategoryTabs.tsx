import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useCategories } from "../../hooks/products/useCategories";
import { productApi } from "../../api/products/productApi";
import { siteConfig } from "../../config/siteConfig";
import ProductCard from "./ProductCard";
import type { Product } from "../../types/models/products/Product";

const CategoryTabs = () => {
  const colors = siteConfig.colors;

  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const [activeTab, setActiveTab] = useState(categories[0]?.name || "");
  const [items, setItems] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const ITEMS_PER_PAGE = 5;
  const ITEMS_PER_TAB = 20;

  // Load categories on mount
  useEffect(() => {
    if (categories.length > 0) {
      setActiveTab(categories[0].slug);
    }
  }, [categories]);

  // Load products when tab changes
  useEffect(() => {
    const loadProducts = async () => {
      if (!activeTab) return;

      setProductsLoading(true);

      try {
        const res = await productApi.getProductsByFilters(
          activeTab,
          {
            minPrice: 0,
            maxPrice: 100000000,
            sortOrder: "newest",
            options: "",
          },
        );

        const list = res?.data?.products || res?.data || res;

        if (!list || !Array.isArray(list)) {
          console.error("Invalid product list:", list);
          setItems([]);
          return;
        }

        const sorted = list.sort((a, b) => b.id - a.id);
        setItems(sorted.slice(0, ITEMS_PER_TAB));
        setPageIndex(0);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [activeTab]);

  // Pagination logic
  const start = pageIndex * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(start, start + ITEMS_PER_PAGE);

  const canNext = start + ITEMS_PER_PAGE < items.length;
  const canPrev = pageIndex > 0;

  // Render loading / error states
  if (categoriesLoading) {
    return (
      <div style={{ borderRadius: 10, width: "100%", maxWidth: 1200, margin: "0 auto", textAlign: "center", background: colors.primarycolor, paddingBottom: 10 }}>
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p style={{ color: "white", marginTop: 16 }}>Loading categories...</p>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div style={{ borderRadius: 10, width: "100%", maxWidth: 1200, margin: "0 auto", textAlign: "center", background: colors.primarycolor, paddingBottom: 10 }}>
        <p style={{ color: "white", fontSize: 18 }}>
          {categoriesError || "No categories available"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full rounded-2xl bg-(--bg-surface)">
      <h2 className="text-4xl font-bold my-8 text-center text-(--text-primary)">Featured Products</h2>

      {/* CATEGORY TABS */}
      <div className="flex justify-start rounded-t-2xl bg-(--bg-surface)">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveTab(cat.slug);
              setPageIndex(0);
            }}
            className={`min-w-38 rounded-t-2xl cursor-pointer px-2 py-4 text-2xl font-bold ${activeTab === cat.slug ? "text-(--text-secondary) bg-(--brand-primary)" : "text-(--text-primary) bg-(--bg-surface)"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* PRODUCTS LIST */}
      {productsLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, padding: 10, minHeight: 400 }}>
          <div style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center" }}>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p style={{ color: "white", marginTop: 12 }}>Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-(--brand-primary)" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, padding: 10 }}>
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", padding: 20, textAlign: "center", color: "White" }}>
                No products found in this category.
              </div>
            )}
          </div>

          {/* PAGINATION BUTTONS */}
          <div className="flex justify-center rounded-b-2xl bg-(--brand-primary)">
            <button
              onClick={() => setPageIndex((p) => p - 1)}
              disabled={!canPrev}
              style={{
                padding: "8px 15px",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <span style={{ color: "white", fontWeight: "bold", position: "relative", top: 6 }}>
              {paginatedItems.length > 0 ? `Page ${pageIndex + 1}` : "No products"}
            </span>

            <button
              onClick={() => setPageIndex((p) => p + 1)}
              disabled={!canNext}
              style={{
                padding: "8px 15px",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryTabs;

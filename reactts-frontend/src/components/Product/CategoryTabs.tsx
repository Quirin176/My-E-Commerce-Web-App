import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { categoryApi } from "../../api/products/categoryApi";
import { productApi } from "../../api/products/productApi";
import { siteConfig } from "../../config/siteConfig";
import ProductCard from "./ProductCard";
import type { Category } from "../../types/models/products/Category";
import type { Product } from "../../types/models/products/Product";

const CategoryTabs = () => {
  const colors = siteConfig.colors;

  // Load categories from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState(categories[0]?.name || "");
  const [items, setItems] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const ITEMS_PER_PAGE = 5;
  const ITEMS_PER_TAB = 20;

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const data = await categoryApi.getAll();
        const categoryList = Array.isArray(data) ? data : (data?.data || []);

        if (categoryList.length === 0) {
          setCategoriesError("No categories available");
          setCategories([]);
          return;
        }

        setCategories(categoryList);
        setActiveTab(categoryList[0].slug);
      } catch (error) {
        console.error("[CategoryTabs] Error loading categories:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to load categories";
        setCategoriesError(errorMessage);
        toast.error(errorMessage);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load products when tab changes
  useEffect(() => {
    const loadProducts = async () => {
      if (!activeTab) return;

      setProductsLoading(true);

      try {
        const res = await productApi.getProductsByCategory(activeTab);
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
        console.error("Error loading products:", error);
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
      <div style={{ borderRadius: 10, width: "100%", maxWidth: 1200, margin: "0 auto", textAlign: "center", background: colors.primarycolor, paddingBottom: 10, padding: 40 }}>
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p style={{ color: "white", marginTop: 16 }}>Loading categories...</p>
      </div>
    );
  }
  if (categoriesError) {
    return (
      <div style={{ borderRadius: 10, width: "100%", maxWidth: 1200, margin: "0 auto", textAlign: "center", background: colors.primarycolor, paddingBottom: 10, padding: 40 }}>
        <p style={{ color: "white", fontSize: 18 }}>
          {categoriesError || "No categories available"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 10, width: "100%", maxWidth: 1200, margin: "0 auto", textAlign: "center", background: colors.primarycolor, paddingBottom: 10 }}>
      {/* CATEGORY TABS */}
      <div style={{ display: "flex", justifyContent: "left", borderTopLeftRadius: 10, borderTopRightRadius: 10, marginBottom: 10, background: "white" }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveTab(cat.slug);
              setPageIndex(0);
            }}
            style={{
              minWidth: 150,
              padding: "10px 20px",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              cursor: "pointer",
              background: activeTab === cat.slug ? colors.primarycolor : "white",
              color: activeTab === cat.slug ? "white" : "black",
              fontSize: 24,
              fontWeight: "bold",
            }}
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, padding: 10 }}>
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
          <div style={{ marginTop: 5, display: "flex", justifyContent: "center", gap: 5, paddingBottom: 5 }}>
            <button
              onClick={() => setPageIndex((p) => p - 1)}
              disabled={!canPrev}
              style={{
                padding: "8px 15px",
                borderRadius: "50%",
                // background: canPrev ? "#444" : "#aaa",
                color: "white",
                cursor: "pointer",
                // cursor: canPrev ? "pointer" : "not-allowed",
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
                // background: canNext ? "#444" : "#aaa",
                color: "white",
                cursor: "pointer",
                // cursor: canNext ? "pointer" : "not-allowed",
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

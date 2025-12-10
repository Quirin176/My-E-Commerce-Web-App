import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { siteConfig } from "../config/siteConfig";
import { productApi } from "../api/productApi";
import ProductCard from "./ProductCard";

const CategoryTabs = ({ products }) => {
  const [activeTab, setActiveTab] = useState(products[0]?.label || "");
  const [items, setItems] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  const ITEMS_PER_PAGE = 5;

  // Load products when tab changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productApi.getByFilters(activeTab);

        const list = res?.data?.products || res?.data || res;

        if (!list || !Array.isArray(list)) {
          console.error("Invalid product list:", list);
          setItems([]);
          return;
        }

        const sorted = list.sort((a, b) => b.id - a.id);
        setItems(sorted);
        setPageIndex(0);
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Failed to load products");
      }
    };

    loadProducts();
  }, [activeTab]);

  // Pagination logic
  const start = pageIndex * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(start, start + ITEMS_PER_PAGE);

  const canNext = start + ITEMS_PER_PAGE < items.length;
  const canPrev = pageIndex > 0;

  return (
    <div style={{ borderRadius: 10, width: "100%", maxWidth: 1500, margin: "0 auto", textAlign: "center", background: "royalblue" }}>
      {/* CATEGORY TABS */}
      <div style={{ display: "flex", justifyContent: "left", borderTopLeftRadius: 10, borderTopRightRadius: 10, marginBottom: 10, background: "white" }}>
        {products.map((cat) => (
          <button
            key={cat.label}
            onClick={() => {
              setActiveTab(cat.label);
              setPageIndex(0);
            }}
            style={{
              minWidth: 150,
              padding: "10px 20px",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              cursor: "pointer",
              background: activeTab === cat.label ? siteConfig.colors.headerBg : "white",
              color: activeTab === cat.label ? "white" : "black",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* PRODUCTS LIST */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, padding: 10 }}>
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", padding: 20, textAlign: "center", color: "#999" }}>
            No products found in this category.
          </div>
        )}
      </div>

      {/* PAGINATION BUTTONS */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 20, paddingBottom: 20 }}>
        <button
          onClick={() => setPageIndex((p) => p - 1)}
          disabled={!canPrev}
          style={{
            padding: "8px 15px",
            borderRadius: 8,
            background: canPrev ? "#444" : "#aaa",
            color: "white",
            cursor: canPrev ? "pointer" : "not-allowed",
          }}
        >
          ←
        </button>

        <span style={{ color: "white", fontWeight: "bold" }}>
          {paginatedItems.length > 0 ? `Page ${pageIndex + 1}` : "No products"}
        </span>

        <button
          onClick={() => setPageIndex((p) => p + 1)}
          disabled={!canNext}
          style={{
            padding: "8px 15px",
            borderRadius: 8,
            background: canNext ? "#444" : "#aaa",
            color: "white",
            cursor: canNext ? "pointer" : "not-allowed",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default CategoryTabs;

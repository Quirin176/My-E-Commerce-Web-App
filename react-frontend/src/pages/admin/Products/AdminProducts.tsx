import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { useProducts } from "../../../hooks/products/useProducts";
import { useProductUrlFilters } from "../../../hooks/useProductUrlFilters";
import { usePagination } from "../../../hooks/usePagination";

import { adminProductsApi } from "../../../api/admin/adminProductsApi";

import SearchBar from "../../../components/SearchBar";
import AdminProductCard from "../../../components/admin/products/AdminProductCard";
import AdminDynamicFilters from "../../../components/admin/products/AdminDynamicFilters";
import PaginationControl from "../../../components/PaginationControl";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const Navigation = useNavigate();

  // ──────────────────── URL-driven filter state ────────────────────
  const { page, sortOrder, minPrice, maxPrice, selectedOptions, updateUrl } = useProductUrlFilters();

  // ──────────────────── Local UI state ────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ──────────────────── Product data fetching ────────────────────
  const { products, totalCount, loading, error, refetch } = useProducts(
    { categorySlug: selectedCategory ?? undefined, pageSize: PAGE_SIZE },
    { searchTerm, minPrice, maxPrice, sortOrder, selectedOptions, currentPage: page, }
  );

  // ──────────────────── Pagination ────────────────────
  const { totalPages, goToPage } = usePagination({
    totalCount,
    pageSize: PAGE_SIZE,
    currentPage: page,
    onPageChange: (p) => updateUrl({ page: p }),
  });

  // ──────────────────── Filter handlers ────────────────────
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug || null);
    updateUrl({ category: slug, selectedOptions: [], page: 1 });
  };

  const applyFilters = () => {
    // Normalize / validate price inputs
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? Number.MAX_SAFE_INTEGER : Number(maxPrice);

    if (min < 0 || max < 0) {
      toast.error("Price cannot be negative.");
      return;
    }

    if (min > max) {
      toast.error("Min price cannot be greater than max price.");
      return;
    }

    updateUrl({ page: 1 });
    refetch();
  };

  const handleDelete = (async (id: number | string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await adminProductsApi.deleteProduct(id);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  });

  return (
    <div className="flex flex-col gap-y-4 p-8 bg-(--bg-muted)">

      {/* ========== HEADER ========== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p>
          {totalCount > 0 ? `${totalCount} total products` : "No products found"}
        </p>

        {/* ========== SEARCH BAR ========== */}
        <div className="relative flex items-center gap-4">
          <input
            type="text"
            placeholder="Search For Products"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setSearchTerm(searchInput);
                updateUrl({ search: searchInput, page: 1 });
              }
            }}
            className="text-lg w-full pl-4 pr-2 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setSearchTerm("");
                updateUrl({ search: undefined, page: 1 });
              }}
              className="right-3 top-3"
            >
              ✕
            </button>
          )}

          <button
            onClick={() => {
              setSearchTerm(searchInput);
              updateUrl({ search: searchInput, page: 1 });
            }}
            className="rounded-full px-2 py-2 text-white bg-(--brand-primary) hover:brightness-75 cursor-pointer"
          >
            <Search size={20} />
          </button>
        </div>
        {/* <div className="flex-1 flex justify-center">
          <SearchBar
            onSuggest={(searchQuery) => handleSuggest(searchQuery)}
            suggestions={suggestions}
            onSearchSubmit={(searchQuery) => handleSearchSubmit(searchQuery)} />
        </div> */}

        {/* ADD NEW PRODUCT BUTTON */}
        <Link
          to={"/admin/products/new"}
          className="flex items-center gap-2 px-6 py-3 text-white bg-(--brand-primary) hover:brightness-75 rounded-lg transition font-semibold whitespace-nowrap cursor-pointer"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* ========== ERROR DISPLAY ========== */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <div>
            <p className="font-semibold">Error Loading Products</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Dynamic filters */}
      <div className="bg-(--bg-surface) rounded-lg">
        <AdminDynamicFilters
          onCategoryChange={handleCategoryChange}
          selectedOptions={selectedOptions}
          setSelectedOptions={(opts: (string | number)[]) => updateUrl({ selectedOptions: opts, page: 1 })}
          minPrice={minPrice}
          setMinPrice={(val: string | number) => updateUrl({ minPrice: String(val), page: 1 })}
          maxPrice={maxPrice}
          setMaxPrice={(val: string | number) => updateUrl({ maxPrice: String(val), page: 1 })}
          sortOrder={sortOrder}
          setSortOrder={(val: string) => updateUrl({ sortOrder: val, page: 1 })}
          onApplyFilters={applyFilters}
        />
      </div>

      {/* ========== PRODUCTS LIST ========== */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-(--bg-surface) rounded-lg border-2 border-dashed border-gray-300">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">
            {searchTerm ? "No products match your search" : "No products found"}
          </p>

          <Link
            to={"/admin/products/new"}
            className="mt-4 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
          >
            {searchTerm ? "Clear Search" : "Create First Product"}
          </Link>
        </div>
      ) : (
        <>
          {/* Products List */}
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg px-8 py-2 bg-(--bg-surface) shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <AdminProductCard
                  product={product}
                  onEdit={() => Navigation(`/admin/products/${product.id}/edit`)}
                  onDelete={() => handleDelete(product.id)}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <PaginationControl
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={goToPage}
            showGoTo={true}
          />
        </>
      )}
    </div>
  );
}

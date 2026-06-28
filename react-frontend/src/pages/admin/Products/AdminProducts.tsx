import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { useProducts } from "../../../hooks/products/useProducts";
import { useProductUrlFilters } from "../../../hooks/useProductUrlFilters";
import { usePagination } from "../../../hooks/usePagination";

import { productApi } from "../../../api/products/productApi";
import { adminProductsApi } from "../../../api/admin/adminProductsApi";

import SearchBar from "../../../components/SearchBar";
import AdminProductCard from "../../../components/admin/products/AdminProductCard";
import AdminDynamicFilters from "../../../components/admin/products/AdminDynamicFilters";
import PaginationControl from "../../../components/PaginationControl";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  const navigate = useNavigate();

  // ──────────────────── URL-driven filter state ────────────────────
  const { page, sortOrder, minPrice, maxPrice, selectedOptions, updateUrl, category } = useProductUrlFilters();

  // ──────────────────── Local UI state ────────────────────
  // Category is derived from URL filters so UI reflects URL on mount/back
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<(number | string)[]>([]);

  const { products, totalCount, loading, error, refetch } = useProducts(
    { categorySlug: category ?? undefined, pageSize: PAGE_SIZE },
    { searchTerm, minPrice, maxPrice, sortOrder, selectedOptions, currentPage: page, }
  );

  const visibleProductIds = products.map((product) => product.id);
  const allVisibleSelected = products.length > 0 && visibleProductIds.every((productId) => selectedProductIds.includes(productId));

  const toggleProductSelection = (id: number | string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
    );
  };

  const toggleSelectPage = () => {
    setSelectedProductIds((prev) =>
      allVisibleSelected
        ? prev.filter((productId) => !visibleProductIds.includes(productId))
        : Array.from(new Set([...prev, ...visibleProductIds]))
    );
  };

  const clearSelection = () => setSelectedProductIds([]);

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;

    if (!window.confirm(`Delete ${selectedProductIds.length} selected product${selectedProductIds.length === 1 ? "" : "s"}?`)) {
      return;
    }

    try {
      await adminProductsApi.deleteSoftMultipleProducts(selectedProductIds);
      toast.success("Selected products deleted");
      clearSelection();
      refetch();
    } catch {
      toast.error("Delete failed for one or more products");
    }
  };

  // ──────────────────── Pagination ────────────────────
  const { totalPages, goToPage } = usePagination({
    totalCount,
    pageSize: PAGE_SIZE,
    currentPage: page,
    onPageChange: (p) => updateUrl({ page: p }),
  });

  // ──────────────────── Filter handlers ────────────────────
  const handleCategoryChange = (slug: string) => {
    updateUrl({ category: slug, selectedOptions: [], page: 1, search: undefined });
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

  const handleSuggest = async (query: string) => {
    const sugs = await productApi.getSuggestions(query, 10);
    setSuggestions(sugs);
  }

  const handleSearchSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setSearchTerm(searchQuery)
      updateUrl({ page: 1 });
      updateUrl({ search: searchQuery })
      refetch();
    }
  };

  const handleDelete = (async (id: number | string, name: string) => {
    if (!window.confirm(`Delete the product "${name}"?`)) return;

    try {
      await adminProductsApi.deleteHardOneProduct(id);
      toast.success("Deleted");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  });

  return (
    <div className="h-full flex flex-col gap-y-4 p-8 bg-(--bg-muted)">

      {/* ========== HEADER ========== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p>
            {totalCount > 0 ? `${totalCount} total products` : "No products found"}
          </p>

          <label className="inline-flex items-center gap-2 text-sm text-(--text-primary)">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectPage}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Select page
          </label>
        </div>

        {/* ========== SEARCH BAR ========== */}
        <div className="flex-1 flex justify-center">
          <SearchBar
            onSuggest={(searchQuery) => handleSuggest(searchQuery)}
            suggestions={suggestions}
            onSearchSubmit={(searchQuery) => handleSearchSubmit(searchQuery)} />
        </div>

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

      {selectedProductIds.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-(--bg-surface) rounded-lg border border-(--border-muted)">
          <p className="text-sm text-(--text-primary)">
            {selectedProductIds.length} product{selectedProductIds.length === 1 ? "" : "s"} selected
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete selected
            </button>
            <button
              type="button"
              disabled
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-not-allowed"
            >
              Set status
            </button>
          </div>
        </div>
      )}

      {/* Dynamic filters */}
      <div className="bg-(--bg-surface) rounded-lg">
        <AdminDynamicFilters
          onCategoryChange={handleCategoryChange}
          selectedCategory={category}
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
          <p className="mt-4">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="h-full flex flex-col gap-4 text-center py-12 bg-(--bg-surface) rounded-lg border-2 border-dashed border-(--text-primary)">
          <AlertCircle size={48} className="mx-auto" />

          <p className="text-lg">
            {searchTerm ? "No products match your search" : "No products found"}
          </p>

          <Link
            to={"/admin/products/new"}
            className="mx-auto w-xs px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
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
                className="border rounded-lg px-4 py-2 bg-(--bg-surface) hover:bg-(--bg-muted) transition"
              >
                <AdminProductCard
                  product={product}
                  selected={selectedProductIds.includes(product.id)}
                  onSelect={toggleProductSelection}
                  onEdit={() => navigate(`/admin/products/${product.id}/edit`)}
                  onDelete={(id, name) => handleDelete(id, name)}
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
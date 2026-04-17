import { useState } from "react";
import { Plus, Search, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useProducts } from "../../../hooks/products/useProducts";
import { useUrlFilters } from "../../../hooks/useUrlFilters";
import { usePagination } from "../../../hooks/usePagination";
import { useAdminProductManager } from "../../../hooks/admin/useAdminProductManager";
import AdminProductCard from "../../../components/Admin/Products/AdminProductCard";
import AdminProductForm from "../../../components/Admin/Products/AdminProductForm";
import AdminDynamicFilters from "../../../components/Admin/Products/AdminDynamicFilters";
import PaginationControl from "../../../components/MainLayout/PaginationControl";

const PAGE_SIZE = 10;

export default function AdminProducts() {
  // ──────────────────── URL-driven filter state ────────────────────
  const { page, sortOrder, minPrice, maxPrice, selectedOptions, updateUrl } = useUrlFilters();

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

  const manager = useAdminProductManager(refetch);

  // ── Filter handlers (write to URL, refetch is automatic via useProducts) ──
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug || null);
    updateUrl({ selectedOptions: [], page: 1 });
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

  return (
    <div className="flex flex-col gap-y-2">

      {/* ========== HEADER ========== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Products Management
          </h1>
          <p className="text-gray-600 mt-1">
            {totalCount > 0
              ? `${totalCount} total products`
              : "No products found"}
          </p>
        </div>

        {/* ========== SEARCH BAR ========== */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search For Products"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setSearchTerm(searchInput);
                updateUrl({ query: searchInput, page: 1 });
              }
            }}
            className="text-lg w-full pl-4 pr-2 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchInput("");
                setSearchTerm("");
                updateUrl({ query: undefined, page: 1 });
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

          )}
          <button
            onClick={() => {
              setSearchTerm(searchInput);
              updateUrl({ query: searchInput, page: 1 });
            }}
            className="rounded-full px-2 py-2 text-white bg-blue-600 hover:text-gray-600 hover:bg-blue-700 cursor-pointer"
          >
            <Search size={20} />
          </button>
        </div>

        <button
          onClick={() => manager.modal.openCreateForm}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold whitespace-nowrap cursor-pointer"
        >
          <Plus size={20} />
          Add Product
        </button>
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

      {/* ========== MODAL DATA LOADING OVERLAY ========== */}
      {manager.modal.isLoadingModalData && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl text-center pointer-events-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Loading product details...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we fetch options and images</p>
          </div>
        </div>
      )}

      {/* Dynamic filters */}
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

      {/* ========== PRODUCTS LIST ========== */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">
            {searchTerm ? "No products match your search" : "No products found"}
          </p>

          <button
            onClick={() => manager.modal.openCreateForm}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {searchTerm ? "Clear Search" : "Create First Product"}
          </button>
        </div>
      ) : (
        <>
          {/* Products List */}
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <AdminProductCard
                  product={product}
                  isLoading={manager.modal.isLoadingModalData}
                  onView={manager.modal.openViewForm}
                  onEdit={manager.modal.openEditForm}
                  onDelete={manager.crud.handleDelete}
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

      {/* ========== PRODUCT FORM ========== */}
      <AdminProductForm
        showForm={manager.modal.showForm}
        editingId={manager.modal.editingId}
        isViewMode={manager.modal.isViewMode}
        formData={manager.form.formData}
        formErrors={manager.form.formErrors}
        filters={manager.filters.filters}
        filtersLoading={manager.filters.filtersLoading}
        submitting={manager.crud.submitting}
        onClose={() => manager.modal.closeForm}
        onSubmit={() => manager.crud.handleSubmit(manager.form.formData, manager.modal.editingId, manager.form.validateForm)}
        updateField={(field: string, value: unknown) => manager.form.updateField(field as keyof typeof manager.form.formData, value)}//
        addImageUrl={manager.form.addImageUrl}
        removeImageUrl={manager.form.removeImageUrl}
        handleOptionChange={manager.form.handleOptionChange}
        autoGenerateSlug={manager.form.autoGenerateSlug}
        onCategoryChange={manager.modal.handleModalCategoryChange}
      />
    </div>
  );
}

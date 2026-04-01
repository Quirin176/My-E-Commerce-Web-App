import { useState } from "react";
import { Plus, Search, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminProductsPaginated } from "../../../hooks/admin/useAdminProductsPaginated";
import { useCategories } from "../../../hooks/useCategories";
import { useProductForm } from "../../../hooks/admin/useProductForm";
import { useAdminProductModal } from "../../../hooks/admin/useAdminProductModal";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import AdminProductCard from "../../../components/Admin/Products/AdminProductCard";
import AdminProductForm from "../../../components/Admin/Products/AdminProductForm";
import AdminDynamicFilters from "../../../components/Admin/Products/AdminDynamicFilters";
import PaginationControl from "../../../components/MainLayout/PaginationControl";
import { categoryApi } from "../../../api/products/categoryApi";
import type { Product } from "../../../types/models/products/Product";
import type { ProductOption } from "../../../types/models/products/ProductOption";

const ITEMS_PER_PAGE = 10;

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();

  // Dynamic filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string | number>("0");
  const [maxPrice, setMaxPrice] = useState<string | number>("100000000");
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get("sort") || "newest");
  const [loadedOptions, setLoadedOptions] = useState<ProductOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Output Data from useAdminProductsPaginated
  const {
    products,
    loading: productsLoading,
    error: productsError,
    currentPage,
    totalPages,
    totalCount,
    fetchProducts,
    goToPage,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdminProductsPaginated({ pageSize: ITEMS_PER_PAGE, minPrice, maxPrice, sortOrder, category: selectedCategory, options: selectedOptions });

  // Form Data
  const {
    formData,
    formErrors,
    validateForm,
    addImageUrl,
    removeImageUrl,
    handleOptionChange,
    updateField,
    resetForm,
    setFormData,
    autoGenerateSlug,
  } = useProductForm();

  // Modal state — edit/view/create logic lives here now
  const {
    showForm,
    editingId,
    isViewMode,
    currentCategoryFilters,
    filtersLoading,
    isLoadingModalData,
    openCreateForm,
    openEditForm,
    openViewForm,
    closeForm,
    loadOptionsForCategory,
  } = useAdminProductModal();

  // ========== LOAD OPTIONS FOR SELECTED CATEGORY ==========
  const handleCategoryChange = async (slug: string) => {
    setSelectedCategory(slug);
    setSelectedOptions([]);

    if (!slug) {
      setLoadedOptions([]);
      return;
    }

    setLoadingFilters(true);

    try {
      const filters = await categoryApi.getAllChildDataByCategorySlug(slug);
      const filterList = Array.isArray(filters) ? filters : (filters?.data || []);
      setLoadedOptions(filterList);
    } catch (error) {
      toast.error("Failed to load category filters");
      setLoadedOptions([]);
    } finally {
      setLoadingFilters(false);
    }
  };

  // ========== HANDLE SEARCH ==========
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    searchProducts(value);
  };

  // ========== PAGE NAVIGATION ==========
  const handleGoToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setSearchParams({ page: String(page) });
    goToPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ========== FORM SUBMISSION ==========
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        price: parseFloat(String(formData.price)),
        imageUrl: formData.images[0] || "",
        imageUrls: formData.images,
        categoryId: Number(formData.categoryId),
        selectedOptionValueIds: formData.selectedOptionValueIds || [],
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      closeForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save product";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ========== CLOSE FORM ==========
  const handleCloseForm = () => {
    resetForm();
    closeForm();
  };

  // ========== CREATE NEW ==========
  const handleCreateNew = () => {
    resetForm();
    openCreateForm();
  };

  // ========== DELETE ==========
  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try { await deleteProduct(Number(id)); } catch { /* toast shown in hook */ }
  };

  // ========== CATEGORY CHANGE IN MODAL ==========
  const handleModalCategoryChange = (categoryId: number) => {
    updateField("categoryId", categoryId);
    updateField("selectedOptionValueIds", []);
    if (categoryId) {
      loadOptionsForCategory(categoryId);
    }
  };

  const applyFilters = () => {
    // Normalize / validate price inputs
    const cleanedMin = minPrice === "" ? 0 : Number(minPrice);
    const cleanedMax = maxPrice === "" ? Number.MAX_SAFE_INTEGER : Number(maxPrice);

    if (cleanedMin < 0 || cleanedMax < 0) {
      toast.error("Price cannot be negative.");
      return;
    }

    if (cleanedMin > cleanedMax) {
      toast.error("Min price cannot be greater than max price.");
      return;
    }

    setSearchParams({ page: "1" });
    fetchProducts(1, searchTerm);
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
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold whitespace-nowrap cursor-pointer"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* ========== ERROR DISPLAY ========== */}
      {productsError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <div>
            <p className="font-semibold">Error Loading Products</p>
            <p className="text-sm">{productsError}</p>
          </div>
        </div>
      )}

      {/* ========== MODAL DATA LOADING OVERLAY ========== */}
      {isLoadingModalData && (
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
        loadedCategories={categories}
        onCategoryChange={handleCategoryChange}
        isLoading={loadingFilters}
        loadedOptions={loadedOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onApplyFilters={applyFilters}
      />

      {/* ========== PRODUCTS LIST ========== */}
      {productsLoading ? (
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
            onClick={handleCreateNew}
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
                  isLoading={isLoadingModalData}
                  onView={(p: Product) => openViewForm(p, setFormData, (f, v) => updateField(f as keyof typeof formData, v))}
                  onEdit={(p: Product) => openEditForm(p, setFormData, (f, v) => updateField(f as keyof typeof formData, v))}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={handleGoToPage}
            showGoTo={true}
          />
        </>
      )}

      {/* ========== CREATE NEW PRODUCT MODAL ========== */}
      <AdminProductForm
        showForm={showForm}
        editingId={editingId}
        isViewMode={isViewMode}
        formData={formData}
        formErrors={formErrors}
        categories={categories}
        filters={currentCategoryFilters}
        filtersLoading={filtersLoading}
        submitting={submitting}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        updateField={(field: string, value: unknown) => updateField(field as keyof typeof formData, value)}
        addImageUrl={addImageUrl}
        removeImageUrl={removeImageUrl}
        handleOptionChange={handleOptionChange}
        autoGenerateSlug={autoGenerateSlug}
        onCategoryChange={handleModalCategoryChange}
      />
    </div>
  );
}

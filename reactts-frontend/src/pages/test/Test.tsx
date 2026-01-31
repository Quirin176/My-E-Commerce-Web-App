import { useState } from "react";
import { Plus, Search, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminProductsPaginated } from "../../hooks/admin/useAdminProductsPaginated";
import { useCategories } from "../../hooks/useCategories";
import { useProductForm } from "../../hooks/admin/useProductForm";
import { useAdminProductForm } from "../../hooks/admin/useAdminProductForm";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import AdminProductCard from "../../components/Admin/AdminProductCard";
import AdminProductForm from "../../components/Admin/AdminProductForm";
import AdminDynamicFilters from "../../components/Admin/AdminDynamicFilters";
import { categoryApi } from "../../api/products/categoryApi";
import type { ProductOption } from "../../types/models/ProductOption";

const ITEMS_PER_PAGE = 10;

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { categories } = useCategories();

  const initialPage = parseInt(searchParams.get("page") || "1");

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

  const {
    showForm,
    editingId,
    isViewMode,
    currentCategoryFilters,
    filtersLoading,
    openCreateForm,
    openEditForm,
    openViewForm,
    closeForm,
    loadOptionsForCategory,
  } = useAdminProductForm();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoadingModalData, setIsLoadingModalData] = useState<boolean>(false);

  // Dynamic filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string | number>("0");
  const [maxPrice, setMaxPrice] = useState<string | number>("100000000");
  const [sortOrder, setPriceOrder] = useState<string>(searchParams.get("sort") || "newest");
  const [loadedOptions, setLoadedOptions] = useState<ProductOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

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
    deleteProduct
  } = useAdminProductsPaginated(ITEMS_PER_PAGE, minPrice, maxPrice, sortOrder, selectedCategory, selectedOptions);

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
      const filters = await categoryApi.getFiltersBySlug(slug);
      const filterList = Array.isArray(filters) ? filters : (filters?.data || []);
      setLoadedOptions(filterList);
    } catch (error) {
      console.error("Error loading filters for category:", error);
      toast.error("Failed to load category filters");
      setLoadedOptions([]);
    } finally {
      setLoadingFilters(false);
    }
  };

  // ========== HANDLE SEARCH ==========
  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    await searchProducts(value);
    setSearchParams({ page: "1" });
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    await searchProducts("");
    setSearchParams({ page: "1" });
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
      console.error("Error saving product:", error);
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

  // ========== CATEGORY CHANGE IN MODAL ==========
  const handleModalCategoryChange = (categoryId: number) => {
    updateField("categoryId", categoryId);
    updateField("selectedOptionValueIds", []);
    if (categoryId) {
      loadOptionsForCategory(categoryId);
    }
  };

  // ========== HANDLE FILTER CHANGES ==========
  const handleFilterChange = (newOptions: (string | number)[]) => {
    setSelectedOptions(newOptions);
    setSearchParams({ page: "1" });
  };

  const handleMinPriceChange = (value: string | number) => {
    setMinPrice(value);
    setSearchParams({ page: "1" });
  };

  const handleMaxPriceChange = (value: string | number) => {
    setMaxPrice(value);
    setSearchParams({ page: "1" });
  };

  const handlePriceOrderChange = (value: string) => {
    setPriceOrder(value);
    setSearchParams({ page: "1" });
  };

const applyFilters = () => {
  // Normalize / validate price inputs
  const cleanedMin = minPrice === "" ? 0 : Number(minPrice);
  const cleanedMax =
    maxPrice === "" ? Number.MAX_SAFE_INTEGER : Number(maxPrice);

  if (cleanedMin < 0 || cleanedMax < 0) {
    toast.error("Price cannot be negative.");
    return;
  }

  if (cleanedMin > cleanedMax) {
    toast.error("Min price cannot be greater than max price.");
    return;
  }

  // Build URL params
  const params: Record<string, string> = {
    page: "1",
  };

  if (selectedCategory) params.category = selectedCategory;
  if (cleanedMin > 0) params.min = cleanedMin.toString();
  if (cleanedMax < Number.MAX_SAFE_INTEGER)
    params.max = cleanedMax.toString();
  if (sortOrder) params.sort = sortOrder;

  if (selectedOptions.length > 0) {
    // Option values CSV (e.g. "1,3,7")
    params.options = selectedOptions.join(",");
  }

  // Update URL
  setSearchParams(params);
  
  // goToPage(1); // Reset pagination in hook
  // searchProducts(searchTerm); // Trigger search with existing API logic

  fetchProducts(1, searchTerm);
};

  // Calculate start and end indices for display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* ========== HEADER ========== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Products Management
            </h1>
            <p className="text-gray-600 mt-1">
              {totalCount > 0
                ? `${totalCount} total products`
                : "No products found"}
            </p>
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

        {/* ========== SEARCH BAR ==========
        <div className="mb-6">
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
                onClick={handleClearSearch}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div> */}

        {/* Dynamic filters */}
        <AdminDynamicFilters
          loadedCategories={categories}
          onCategoryChange={handleCategoryChange}
          loadedOptions={loadedOptions}
          selectedOptions={selectedOptions}
          setSelectedOptions={handleFilterChange}
          minPrice={minPrice}
          setMinPrice={handleMinPriceChange}
          maxPrice={maxPrice}
          setMaxPrice={handleMaxPriceChange}
          sortOrder={sortOrder}
          setSortOrder={handlePriceOrderChange}
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
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
            {!searchTerm && (
              <button
                onClick={handleCreateNew}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create First Product
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Products List */}
            <div className="space-y-3 mb-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                  <AdminProductCard
                    product={product}
                    isLoading={isLoadingModalData}
                    showForm={showForm}
                    editingId={editingId}
                    isViewMode={isViewMode}
                    formData={formData}
                    formErrors={formErrors}
                    categories={categories}
                    filters={currentCategoryFilters}
                    filtersLoading={filtersLoading}
                    submitting={submitting}
                    onCloseForm={handleCloseForm}
                    onSubmit={handleSubmit}
                    updateField={(field: string, value: unknown) => updateField(field as keyof typeof formData, value)}
                    addImageUrl={addImageUrl}
                    removeImageUrl={removeImageUrl}
                    handleOptionChange={handleOptionChange}
                    autoGenerateSlug={autoGenerateSlug}
                    onCategoryChange={handleModalCategoryChange}
                    setFormData={setFormData}
                    resetForm={resetForm}
                    openEditForm={openEditForm}
                    openViewForm={openViewForm}
                    loadOptionsForCategory={loadOptionsForCategory}
                  />
                </div>
              ))}
            </div>

            {/* ========== PAGINATION ========== */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-gray-600 text-sm">
                  Showing <strong>{startIndex}</strong> to <strong>{endIndex}</strong> of <strong>{totalCount}</strong> products
                  {searchTerm && (
                    <span className="ml-2 text-blue-600">
                      (filtered)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGoToPage(currentPage - 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Previous page"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleGoToPage(1)}
                      className={`px-3 py-2 rounded-lg font-semibold transition ${currentPage === 1
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      1
                    </button>

                    {currentPage > 3 && (
                      <span className="px-2 py-2 text-gray-400">...</span>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page > 1 &&
                          page < totalPages &&
                          Math.abs(page - currentPage) <= 1
                      )
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => handleGoToPage(page)}
                          className={`px-3 py-2 rounded-lg font-semibold transition ${currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      ))}

                    {currentPage < totalPages - 2 && (
                      <span className="px-2 py-2 text-gray-400">...</span>
                    )}

                    {totalPages > 1 && (
                      <button
                        onClick={() => handleGoToPage(totalPages)}
                        className={`px-3 py-2 rounded-lg font-semibold transition ${currentPage === totalPages
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleGoToPage(currentPage + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Next page"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="pageInput" className="text-sm text-gray-600">
                    Go to:
                  </label>
                  <input
                    id="pageInput"
                    type="number"
                    min="1"
                    max={totalPages}
                    defaultValue={currentPage}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const value = parseInt(
                          (e.target as HTMLInputElement).value
                        );
                        if (!isNaN(value)) {
                          handleGoToPage(value);
                        }
                      }
                    }}
                    className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* ========== CREATE NEW PRODUCT MODAL ========== */}
        {showForm && editingId === null && (
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
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronDown,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminProductsPaginated } from "../../hooks/admin/useAdminProductsPaginated";
import { useCategories } from "../../hooks/useCategories";
import { useProductForm } from "../../hooks/admin/useProductForm";
import { useProductModal } from "../../hooks/admin/useProductModal";
import ProductFormModal from "../../components/Admin/AdminProductFormModal";
import type { Product } from "../../types/models/Product";

const AdminProducts = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdminProductsPaginated();

  const { categories } = useCategories();

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
    expandedProduct,
    currentCategoryFilters,
    filtersLoading,
    openCreateForm,
    openEditForm,
    closeForm,
    toggleExpandProduct,
    loadFiltersForCategory,
  } = useProductModal();

  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ========== HANDLE SEARCH ==========
  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    await searchProducts(value);
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    await searchProducts("");
  };

  // ========== PAGE NAVIGATION ==========
  const handleGoToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    goToPage(page);
    // Smooth scroll to top
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
      const message =
        error instanceof Error ? error.message : "Failed to save product";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ========== EDIT PRODUCT ==========
  const handleEdit = (product: Product) => {
    const images: string[] =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.imageUrl
        ? [product.imageUrl]
        : [];

    const selectedIds: number[] = [];
    if (product.options && Array.isArray(product.options)) {
      product.options.forEach((opt) => {
        currentCategoryFilters.forEach((filter) => {
          filter.optionValues?.forEach((value) => {
            if (value.value === opt.value) {
              selectedIds.push(value.optionValueId);
            }
          });
        });
      });
    }

    setFormData({
      id: product.id || "",
      name: product.name || "",
      slug: product.slug || "",
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      price: product.price || 0,
      imageUrl: "",
      images: images,
      categoryId: product.categoryId || "",
      selectedOptionValueIds: selectedIds,
    });

    if (product.categoryId) {
      loadFiltersForCategory(Number(product.categoryId));
    }

    openEditForm(Number(product.id));
  };

  // ========== DELETE PRODUCT ==========
  const handleDelete = async (id: number | string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteProduct(Number(id));
    } catch (error) {
      console.error("Error deleting product:", error);
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
      loadFiltersForCategory(categoryId);
    }
  };

  // Calculate start and end indices for display
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold whitespace-nowrap"
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

        {/* ========== PRODUCT FORM MODAL ========== */}
        <ProductFormModal
          showForm={showForm}
          editingId={editingId}
          formData={formData}
          formErrors={formErrors}
          categories={categories}
          filters={currentCategoryFilters}
          filtersLoading={filtersLoading}
          submitting={submitting}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          updateField={(field: string, value: unknown) =>
            updateField(field as keyof typeof formData, value)
          }
          addImageUrl={addImageUrl}
          removeImageUrl={removeImageUrl}
          handleOptionChange={handleOptionChange}
          autoGenerateSlug={autoGenerateSlug}
          onCategoryChange={handleModalCategoryChange}
        />

        {/* ========== SEARCH BAR ========== */}
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
        </div>

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
                  {/* Product Row Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => toggleExpandProduct(Number(product.id))}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Product Image & Info */}
                      <div className="flex gap-4 flex-1 min-w-0">
                        <img
                          src={
                            product.imageUrl ||
                            "https://via.placeholder.com/80?text=No+Image"
                          }
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/80?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-800 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {product.slug}
                          </p>
                          <p className="text-blue-600 font-semibold mt-1">
                            {product.price?.toLocaleString("vi-VN")} VND
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product);
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Edit product"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Delete product"
                        >
                          <Trash2 size={18} />
                        </button>
                        <ChevronDown
                          size={20}
                          className={`transition mt-2 ${
                            expandedProduct === product.id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Product Details */}
                  {expandedProduct === product.id && (
                    <div className="border-t p-6 bg-gray-50 space-y-4">
                      {product.shortDescription && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">
                            Short Description
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {product.shortDescription}
                          </p>
                        </div>
                      )}

                      {product.description && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">
                            Description
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {product.description}
                          </p>
                        </div>
                      )}

                      {product.options && product.options.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Attributes
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {product.options.map((opt, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                              >
                                <strong>{opt.optionName}:</strong> {opt.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.images && product.images.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Gallery ({product.images.length} images)
                          </h4>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`${product.name} ${idx + 1}`}
                                className="w-24 h-24 object-cover rounded flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/96?text=No+Image";
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {product.category && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-1">
                            Category
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {product.category.name}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ========== PAGINATION ========== */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Pagination Info */}
                <div className="text-gray-600 text-sm">
                  Showing <strong>{startIndex}</strong> to{" "}
                  <strong>{endIndex}</strong> of{" "}
                  <strong>{totalCount}</strong> products
                  {searchTerm && (
                    <span className="ml-2 text-blue-600">
                      (filtered)
                    </span>
                  )}
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handleGoToPage(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Previous page"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {/* First Page */}
                    <button
                      onClick={() => handleGoToPage(1)}
                      className={`px-3 py-2 rounded-lg font-semibold transition ${
                        currentPage === 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      1
                    </button>

                    {/* Ellipsis for skipped pages */}
                    {currentPage > 3 && (
                      <span className="px-2 py-2 text-gray-400">...</span>
                    )}

                    {/* Middle Pages */}
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
                          className={`px-3 py-2 rounded-lg font-semibold transition ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                    {/* Ellipsis for skipped pages */}
                    {currentPage < totalPages - 2 && (
                      <span className="px-2 py-2 text-gray-400">...</span>
                    )}

                    {/* Last Page */}
                    {totalPages > 1 && (
                      <button
                        onClick={() => handleGoToPage(totalPages)}
                        className={`px-3 py-2 rounded-lg font-semibold transition ${
                          currentPage === totalPages
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handleGoToPage(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Next page"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Page Input */}
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
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && e.target.value.length > 0) {
                        handleGoToPage(value);
                      }
                    }}
                    className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
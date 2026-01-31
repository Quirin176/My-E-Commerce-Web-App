// THIS IS A COMPONENT FOR DISPLAYING A PRODUCT CARD IN THE ADMIN DASHBOARD WITH OPTIONS TO VIEW, EDIT, OR DELETE THE PRODUCT

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminProductsPaginated } from "../../hooks/admin/useAdminProductsPaginated";
import AdminProductForm from "./AdminProductForm";
import type { Product } from "../../types/models/Product";
import type { Category } from "../../types/models/Category";
import type { ProductOption } from "../../types/models/ProductOption";
import type { ProductFormData } from "../../hooks/admin/useProductForm";

interface AdminProductCardProps {
  product: Product;
  isLoading: boolean;
  setIsLoadingModalData: (loading: boolean) => void;
  showForm: boolean;
  editingId: number | null;
  isViewMode: boolean;
  formData: ProductFormData;
  formErrors: Record<string, string>;
  categories: Category[];
  filters: ProductOption[];
  filtersLoading: boolean;
  submitting: boolean;
  onCloseForm: () => void;
  onSubmit: () => Promise<void>;
  updateField: (field: string, value: unknown) => void;
  addImageUrl: () => void;
  removeImageUrl: (index: number) => void;
  handleOptionChange: (optionValueId: number) => void;
  autoGenerateSlug: (name: string) => void;
  onCategoryChange: (categoryId: number) => void;
  setFormData: (data: ProductFormData) => void;
  resetForm: () => void;
  openEditForm: (id: number) => void;
  openViewForm: (id: number) => void;
  loadOptionsForCategory: (categoryId: number) => Promise<ProductOption[]>;
}

export default function AdminProductCard({
  product,
  isLoading,
  setIsLoadingModalData,
  showForm,
  editingId,
  isViewMode,
  formData,
  formErrors,
  categories,
  filters,
  filtersLoading,
  submitting,
  onCloseForm,
  onSubmit,
  updateField,
  addImageUrl,
  removeImageUrl,
  handleOptionChange,
  autoGenerateSlug,
  onCategoryChange,
  setFormData,
  resetForm,
  openEditForm,
  openViewForm,
  loadOptionsForCategory,
}: AdminProductCardProps) {

  const { deleteProduct } = useAdminProductsPaginated(10);

  // ========== EDIT PRODUCT ==========
  const handleEdit = async (productData: Product) => {
    setIsLoadingModalData(true);
    try {
      console.log("[handleEdit] Starting edit for product:", productData.id);

      // Get images
      const images: string[] =
        Array.isArray(productData.images) && productData.images.length > 0
          ? productData.images
          : productData.imageUrl
            ? [productData.imageUrl]
            : [];

      // Set form data immediately
      setFormData({
        id: productData.id || "",
        name: productData.name || "",
        slug: productData.slug || "",
        shortDescription: productData.shortDescription || "",
        description: productData.description || "",
        price: productData.price || 0,
        imageUrl: "",
        images: images,
        categoryId: productData.categoryId || "",
        selectedOptionValueIds: [],
      });

      console.log("[handleEdit] Form data set, loading options...");

      // Wait for options to load
      if (productData.categoryId) {
        const loadedFilters = await loadOptionsForCategory(Number(productData.categoryId));
        console.log("[handleEdit] Filters loaded:", loadedFilters);

        // Map product options to selected option value IDs
        const selectedIds: number[] = [];
        if (productData.options && Array.isArray(productData.options)) {
          productData.options.forEach((opt) => {
            loadedFilters.forEach((filter) => {
              filter.optionValues?.forEach((value) => {
                if (value.value === opt.value) {
                  selectedIds.push(value.optionValueId);
                }
              });
            });
          });
        }

        console.log("[handleEdit] Selected option IDs:", selectedIds);

        // Update form with selected options
        updateField("selectedOptionValueIds", selectedIds);
      }

      console.log("[handleEdit] Opening form...");
      openEditForm(Number(productData.id));
    } catch (error) {
      console.error("Error loading product for edit:", error);
      toast.error("Failed to load product details");
    } finally {
      setIsLoadingModalData(false);
    }
  };

  // ========== VIEW PRODUCT ==========
  const handleView = async (productData: Product) => {
    setIsLoadingModalData(true);
    try {
      console.log("[handleView] Starting view for product:", productData.id);

      // Get images
      const images: string[] =
        Array.isArray(productData.images) && productData.images.length > 0
          ? productData.images
          : productData.imageUrl
            ? [productData.imageUrl]
            : [];

      // Set form data immediately
      setFormData({
        id: productData.id || "",
        name: productData.name || "",
        slug: productData.slug || "",
        shortDescription: productData.shortDescription || "",
        description: productData.description || "",
        price: productData.price || 0,
        imageUrl: "",
        images: images,
        categoryId: productData.categoryId || "",
        selectedOptionValueIds: [],
      });

      console.log("[handleView] Form data set, loading options...");

      // Wait for options to load
      if (productData.categoryId) {
        const loadedFilters = await loadOptionsForCategory(Number(productData.categoryId));
        console.log("[handleView] Filters loaded:", loadedFilters);

        // Map product options to selected option value IDs
        const selectedIds: number[] = [];
        if (productData.options && Array.isArray(productData.options)) {
          productData.options.forEach((opt) => {
            loadedFilters.forEach((filter) => {
              filter.optionValues?.forEach((value) => {
                if (value.value === opt.value) {
                  selectedIds.push(value.optionValueId);
                }
              });
            });
          });
        }

        console.log("[handleView] Selected option IDs:", selectedIds);

        // Update form with selected options
        updateField("selectedOptionValueIds", selectedIds);
      }

      console.log("[handleView] Opening form...");
      openViewForm(Number(productData.id));
    } catch (error) {
      console.error("Error loading product for view:", error);
      toast.error("Failed to load product details");
    } finally {
      setIsLoadingModalData(false);
    }
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

  return (
    <>
      <div
        className="border rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-gray-100 transition-shadow cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleView(product);
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-row items-center gap-2">
            <img
              src={
                product.imageUrl ||
                product.images[0] ||
                "https://via.placeholder.com/200x150?text=No+Image"
              }
              alt={product.name}
              className="w-20 h-20 object-cover rounded shrink-0"
            />
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category?.name}</p>
              </div>
              <p className="text-sm text-gray-500">{product.slug}</p>
            </div>
          </div>
          <div className="flex flex-row gap-20">
            <span className="text-lg font-bold text-blue-600">
              {product.price?.toLocaleString("vi-VN")} VND
            </span>

            <div className="flex flex-row gap-2">
              <button
                title="Edit Product"
                disabled={isLoading}
                className="p-2 border rounded cursor-pointer text-blue-600 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(product);
                }}
              >
                <Edit2 size={18} />
              </button>

              <button
                title="Delete Product"
                disabled={isLoading}
                className="p-2 border rounded cursor-pointer text-red-600 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(product.id);
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PRODUCT FORM MODAL ========== */}
      {showForm && editingId === Number(product.id) && (
        <AdminProductForm
          showForm={showForm}
          editingId={editingId}
          isViewMode={isViewMode}
          formData={formData}
          formErrors={formErrors}
          categories={categories}
          filters={filters}
          filtersLoading={filtersLoading}
          submitting={submitting}
          onClose={onCloseForm}
          onSubmit={onSubmit}
          updateField={updateField}
          addImageUrl={addImageUrl}
          removeImageUrl={removeImageUrl}
          handleOptionChange={handleOptionChange}
          autoGenerateSlug={autoGenerateSlug}
          onCategoryChange={onCategoryChange}
        />
      )}
    </>
  );
}

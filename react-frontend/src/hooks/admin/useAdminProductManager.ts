// import { useCallback, useState } from "react";
// import toast from "react-hot-toast";
// import { categoryApi } from "../../api/products/categoryApi";
// import { adminProductsApi } from "../../api/admin/adminProductsApi";
// import { slugify } from "../../utils/slugify";
// import type { Product } from "../../types/models/products/Product";
// import type { ProductOption } from "../../types/models/products/ProductOption";

// // Define the structure of the product form data
// export interface ProductFormData {
//   id: string | number;
//   name: string;
//   slug: string;
//   shortDescription: string;
//   description: string;
//   price: number | string;
//   imageUrl: string;
//   images: string[];
//   categoryId: number | string;
//   selectedOptionValueIds: number[];
// }

// // Initial form data template
// const INITIAL_FORM_DATA: ProductFormData = {
//   id: "",
//   name: "",
//   slug: "",
//   shortDescription: "",
//   description: "",
//   price: "",
//   imageUrl: "",
//   images: [],
//   categoryId: "",
//   selectedOptionValueIds: [],
// };

// export const useAdminProductManager = (onRefetch: () => void) => {
  // // ── Form state ──
  // const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  // const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // // ── Modal state ──
  // const [showForm, setShowForm] = useState(false);
  // const [editingId, setEditingId] = useState<number | null>(null);
  // const [isViewMode, setIsViewMode] = useState(false);
  // const [isLoadingModalData, setIsLoadingModalData] = useState(false);

  // // ── Category options state ──
  // const [filters, setFilters] = useState<ProductOption[]>([]);
  // const [filtersLoading, setFiltersLoading] = useState(false);

  // // ── Submission state ──
  // const [submitting, setSubmitting] = useState(false);

  // // ────────────────────────────────────────────────────────────────
  // // Form field helpers
  // // ────────────────────────────────────────────────────────────────
  // const updateField = useCallback((field: keyof ProductFormData, value: unknown) => {
  //   setFormData(prev => ({ ...prev, [field]: value }));
  //   setFormErrors(prev => {
  //     if (!prev[field]) return prev;
  //     const next = { ...prev };
  //     delete next[field];
  //     return next;
  //   });
  // }, []);

  // const autoGenerateSlug = useCallback((name: string) => {
  //   setFormData(prev => ({ ...prev, name, slug: slugify(name) }));
  // }, []);

  // const addImageUrl = useCallback(() => {
  //   const url = formData.imageUrl?.trim();
  //   if (!url) {
  //     setFormErrors(prev => ({ ...prev, imageUrl: "Please enter an image URL" }));
  //     return;
  //   }
  //   if (!url.startsWith("http://") && !url.startsWith("https://")) {
  //     setFormErrors(prev => ({ ...prev, imageUrl: "URL must start with http:// or https://" }));
  //     return;
  //   }
  //   if (formData.images.includes(url)) {
  //     setFormErrors(prev => ({ ...prev, imageUrl: "This image URL already exists" }));
  //     return;
  //   }
  //   setFormData(prev => ({ ...prev, images: [...prev.images, url], imageUrl: "" }));
  //   setFormErrors(prev => { const n = { ...prev }; delete n.imageUrl; return n; });
  // }, [formData.imageUrl, formData.images]);

  // const removeImageUrl = useCallback((index: number) => {
  //   setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  // }, []);

  // const handleOptionChange = useCallback((optionValueId: number) => {
  //   setFormData(prev => {
  //     const selected = prev.selectedOptionValueIds.includes(optionValueId);
  //     return {
  //       ...prev,
  //       selectedOptionValueIds: selected
  //         ? prev.selectedOptionValueIds.filter(id => id !== optionValueId)
  //         : [...prev.selectedOptionValueIds, optionValueId],
  //     };
  //   });
  // }, []);

  // const validateForm = useCallback((): boolean => {
  //   const errors: Record<string, string> = {};
  //   if (!formData.name.trim()) errors.name = "Product name is required";
  //   if (!formData.slug.trim()) errors.slug = "Product slug is required";
  //   const price = Number(formData.price);
  //   if (isNaN(price) || price <= 0) errors.price = "Valid price is required (must be greater than 0)";
  //   if (!formData.categoryId || Number(formData.categoryId) <= 0) errors.categoryId = "Category is required";
  //   if (!formData.images.length) errors.images = "At least one image is required";
  //   setFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // }, [formData]);

  // const resetForm = useCallback(() => {
  //   setFormData(INITIAL_FORM_DATA);
  //   setFormErrors({});
  // }, []);

  // // ────────────────────────────────────────────────────────────────
  // // Category options loading
  // // ────────────────────────────────────────────────────────────────
  // const loadOptionsForCategory = useCallback(async (categoryId: number): Promise<ProductOption[]> => {
  //   if (!categoryId || categoryId <= 0) { setFilters([]); return []; }
  //   setFiltersLoading(true);
  //   try {
  //     const data = await categoryApi.getAllChildDataByCategoryId(categoryId);
  //     const raw = Array.isArray(data) ? data : (data?.data ?? []);
  //     const valid = raw.filter((o: ProductOption) => o.optionId && o.optionName && Array.isArray(o.optionValues));
  //     setFilters(valid);
  //     return valid;
  //   } catch {
  //     toast.error("Failed to load product attributes");
  //     setFilters([]);
  //     return [];
  //   } finally {
  //     setFiltersLoading(false);
  //   }
  // }, []);

  // // ────────────────────────────────────────────────────────────────
  // // Modal open helpers (private)
  // // ────────────────────────────────────────────────────────────────
  // const loadProductIntoForm = useCallback(async (product: Product) => {
  //   setIsLoadingModalData(true);
  //   try {
  //     const images = Array.isArray(product.images) && product.images.length > 0
  //       ? product.images
  //       : product.imageUrl ? [product.imageUrl] : [];

  //     setFormData({
  //       id: product.id ?? "",
  //       name: product.name ?? "",
  //       slug: product.slug ?? "",
  //       shortDescription: product.shortDescription ?? "",
  //       description: product.description ?? "",
  //       price: product.price ?? 0,
  //       imageUrl: "",
  //       images,
  //       categoryId: product.categoryId ?? "",
  //       selectedOptionValueIds: [],
  //     });

  //     if (product.categoryId) {
  //       const loadedFilters = await loadOptionsForCategory(Number(product.categoryId));
  //       const selectedIds: number[] = [];
  //       (product.options ?? []).forEach(opt => {
  //         if (!("optionValues" in opt)) return;
  //         opt.optionValues.forEach(optVal => {
  //           loadedFilters.forEach(filter => {
  //             filter.optionValues.forEach(fv => {
  //               if (fv.value === optVal.value) selectedIds.push(fv.id);
  //             });
  //           });
  //         });
  //       });
  //       setFormData(prev => ({ ...prev, selectedOptionValueIds: selectedIds }));
  //     }
  //   } catch {
  //     toast.error("Failed to load product details");
  //   } finally {
  //     setIsLoadingModalData(false);
  //   }
  // }, [loadOptionsForCategory]);

  // // ────────────────────────────────────────────────────────────────
  // // Public modal actions
  // // ────────────────────────────────────────────────────────────────
  // const openCreateForm = useCallback(() => {
  //   resetForm();
  //   setFilters([]);
  //   setEditingId(null);
  //   setIsViewMode(false);
  //   setShowForm(true);
  // }, [resetForm]);

  // const openEditForm = useCallback(async (product: Product) => {
  //   await loadProductIntoForm(product);
  //   setEditingId(Number(product.id));
  //   setIsViewMode(false);
  //   setShowForm(true);
  // }, [loadProductIntoForm]);

  // const openViewForm = useCallback(async (product: Product) => {
  //   await loadProductIntoForm(product);
  //   setEditingId(Number(product.id));
  //   setIsViewMode(true);
  //   setShowForm(true);
  // }, [loadProductIntoForm]);

  // const closeForm = useCallback(() => {
  //   resetForm();
  //   setShowForm(false);
  //   setEditingId(null);
  //   setIsViewMode(false);
  //   setFilters([]);
  // }, [resetForm]);

  // // ────────────────────────────────────────────────────────────────
  // // Category change inside the modal
  // // ────────────────────────────────────────────────────────────────
  // const handleModalCategoryChange = useCallback((categoryId: number) => {
  //   updateField("categoryId", categoryId);
  //   updateField("selectedOptionValueIds", []);
  //   if (categoryId) loadOptionsForCategory(categoryId);
  // }, [updateField, loadOptionsForCategory]);

  // // ────────────────────────────────────────────────────────────────
  // // CRUD operations (previously scattered in AdminProducts.tsx)
  // // ────────────────────────────────────────────────────────────────
  // const handleSubmit = useCallback(async () => {
  //   if (!validateForm()) { toast.error("Please fix the errors below"); return; }
  //   setSubmitting(true);
  //   try {
  //     const payload = {
  //       name: formData.name.trim(),
  //       slug: formData.slug.trim(),
  //       shortDescription: formData.shortDescription.trim(),
  //       description: formData.description.trim(),
  //       price: parseFloat(String(formData.price)),
  //       imageUrl: formData.images[0] ?? "",
  //       imageUrls: formData.images,
  //       categoryId: Number(formData.categoryId),
  //       selectedOptionValueIds: formData.selectedOptionValueIds,
  //     };
  //     if (editingId) {
  //       await adminProductsApi.updateProductById(editingId, payload);
  //       toast.success("Product updated successfully!");
  //     } else {
  //       await adminProductsApi.createProduct(payload);
  //       toast.success("Product created successfully!");
  //     }
  //     closeForm();
  //     onRefetch();
  //   } catch (err) {
  //     toast.error(err instanceof Error ? err.message : "Failed to save product");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // }, [validateForm, formData, editingId, closeForm, onRefetch]);

  // const handleDelete = useCallback(async (id: number | string) => {
  //   if (!window.confirm("Delete this product? This cannot be undone.")) return;
  //   try {
  //     await adminProductsApi.deleteProduct(id);
  //     toast.success("Product deleted!");
  //     onRefetch();
  //   } catch (err) {
  //     toast.error(err instanceof Error ? err.message : "Failed to delete product");
  //   }
  // }, [onRefetch]);

//   return {
//     // form
//     formData, formErrors,
//     updateField, autoGenerateSlug,
//     addImageUrl, removeImageUrl, handleOptionChange,
//     // modal
//     showForm, editingId, isViewMode, isLoadingModalData,
//     openCreateForm, openEditForm, openViewForm, closeForm,
//     // category options
//     filters, filtersLoading,
//     loadOptionsForCategory, handleModalCategoryChange,
//     // submission / delete
//     submitting, handleSubmit, handleDelete,
//   };
// };
import { useProductForm } from "./useProductForm";
import { useProductModal } from "./useProductModal";
import { useProductFilters } from "../products/useProductFilters";
import { useProductCRUD } from "./useProductCRUD";

export const useAdminProductManager = (onRefetch: () => void) => {
  const form = useProductForm();
  const modal = useProductModal();
  const filters = useProductFilters();
  const crud = useProductCRUD();

  return {
    form,
    modal,
    filters,
    crud,
  };
};
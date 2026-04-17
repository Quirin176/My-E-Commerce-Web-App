// import { useCallback, useState } from "react";
// import toast from "react-hot-toast";
// import { categoryApi } from "../../api/products/categoryApi";
// import type { Product } from "../../types/models/products/Product";
// import type { ProductOption } from "../../types/models/products/ProductOption";
// import type { ProductFormData } from "./useProductForm";

// interface UseAdminProductModalReturn {
//   showForm: boolean;
//   editingId: number | null;
//   isViewMode: boolean;
//   currentCategoryFilters: ProductOption[];
//   filtersLoading: boolean;
//   isLoadingModalData: boolean;
//   openCreateForm: () => void;
//   openEditForm: (product: Product, setFormData: (d: ProductFormData) => void, updateField: (f: string, v: unknown) => void) => Promise<void>;
//   openViewForm: (product: Product, setFormData: (d: ProductFormData) => void, updateField: (f: string, v: unknown) => void) => Promise<void>;
//   closeForm: () => void;
//   loadOptionsForCategory: (categoryId: number) => Promise<ProductOption[]>;
// }

// export const useAdminProductModal = (): UseAdminProductModalReturn => {
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [isViewMode, setIsViewMode] = useState(false);
//   const [currentCategoryFilters, setCurrentCategoryFilters] = useState<ProductOption[]>([]);
//   const [filtersLoading, setFiltersLoading] = useState(false);
//   const [isLoadingModalData, setIsLoadingModalData] = useState(false);

//   // Load all options and all their optionvalues for a category by ID
//   const loadOptionsForCategory = useCallback(async (categoryId: number): Promise<ProductOption[]> => {
//     if (!categoryId || categoryId <= 0) {
//       setCurrentCategoryFilters([]);
//       return [];
//     }

//     setFiltersLoading(true);

//     try {
//       const data = await categoryApi.getAllChildDataByCategoryId(categoryId);
//       const filters = Array.isArray(data) ? data : (data?.data || []);

//       // Validate filter structure - optionId should be valid (not null or undefined), optionName should be valid (not null or undefined)
//       // and optionValues should be an array
//       const validFilters = filters.filter((o: ProductOption) =>
//         o.optionId &&
//         o.optionName &&
//         Array.isArray(o.optionValues)
//       );

//       setCurrentCategoryFilters(validFilters);
//       return validFilters;
//     } catch (error) {
//       toast.error("Failed to load product attributes");
//       setCurrentCategoryFilters([]);
//       return [];
//     } finally {
//       setFiltersLoading(false);
//     }
//   }, []);

//   // Load product data into form
//   const loadProductIntoForm = useCallback(async (
//     product: Product,
//     setFormData: (d: ProductFormData) => void,
//     updateField: (f: string, v: unknown) => void,
//   ): Promise<void> => {
//     setIsLoadingModalData(true);

//     try {
//       const images = Array.isArray(product.images) && product.images.length > 0 ?
//         product.images : product.imageUrl ? [product.imageUrl] : [];

//       setFormData({
//         id: product.id ?? "",
//         name: product.name ?? "",
//         slug: product.slug ?? "",
//         shortDescription: product.shortDescription ?? "",
//         description: product.description ?? "",
//         price: product.price ?? 0,
//         imageUrl: "",
//         images,
//         categoryId: product.categoryId ?? "",
//         selectedOptionValueIds: [],
//       });

//       if (product.categoryId) {
//         const loadedFilters = await loadOptionsForCategory(Number(product.categoryId));
//         const selectedIds: number[] = [];

//         (product.options ?? []).forEach((opt) => {
//           if (!("optionValues" in opt)) return;
//           opt.optionValues.forEach((optVal) => {
//             loadedFilters.forEach((filter) => {
//               filter.optionValues.forEach((fv) => {
//                 if (fv.value === optVal.value) selectedIds.push(fv.id);
//               });
//             });
//           });
//         });

//         updateField("selectedOptionValueIds", selectedIds);
//       }
//     } catch {
//       toast.error("Failed to load product details");
//     } finally {
//       setIsLoadingModalData(false);
//     }
//   }, [loadOptionsForCategory]);

//   const openCreateForm = useCallback(() => {
//     setEditingId(null);
//     setIsViewMode(false);
//     setShowForm(true);
//   }, []);

//   const openEditForm = useCallback(async (
//     product: Product,
//     setFormData: (d: ProductFormData) => void,
//     updateField: (f: string, v: unknown) => void,
//   ) => {
//     await loadProductIntoForm(product, setFormData, updateField);
//     setEditingId(Number(product.id));
//     setIsViewMode(false);
//     setShowForm(true);
//   }, [loadProductIntoForm]);

//   const openViewForm = useCallback(async (
//     product: Product,
//     setFormData: (d: ProductFormData) => void,
//     updateField: (f: string, v: unknown) => void,
//   ) => {
//     await loadProductIntoForm(product, setFormData, updateField);
//     setEditingId(Number(product.id));
//     setIsViewMode(true);
//     setShowForm(true);
//   }, [loadProductIntoForm]);

//   const closeForm = useCallback(() => {
//     setShowForm(false);
//     setEditingId(null);
//     setIsViewMode(false);
//   }, []);

//   return {
//     showForm,
//     editingId,
//     isViewMode,
//     currentCategoryFilters,
//     filtersLoading,
//     isLoadingModalData,
//     openCreateForm,
//     openEditForm,
//     openViewForm,
//     closeForm,
//     loadOptionsForCategory,
//   };
// };
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useProductFilters } from "../products/useProductFilters";
import { useProductForm } from "./useProductForm";
import type { Product } from "../../types/models/products/Product";

interface UseProductModalReturn {
  showForm: boolean;
  editingId: number | null;
  isViewMode: boolean;
  isLoadingModalData: boolean;
  handleModalCategoryChange: (categoryId: number) => void;
  openCreateForm: (resetForm: () => void, clearFilters: () => void) => void;
  openEditForm: (product: Product) => Promise<void>;
  openViewForm: (product: Product) => Promise<void>;
  closeForm: (resetForm: () => void, clearFilters: () => void) => void;
}

/**
 * Manages the open/close state of the product form modal,
 * and handles populating form data when opening edit/view modes.
 */
export const useProductModal = (): UseProductModalReturn => {

  const { filters, loadOptionsForCategory, clearFilters } = useProductFilters()

  const { setFormData, updateField, resetForm } = useProductForm();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isLoadingModalData, setIsLoadingModalData] = useState(false);

  // Populate form fields from a product, including resolving selected option IDs
  // ────────────────────────────────────────────────────────────────
  // Modal open helpers (private)
  // ────────────────────────────────────────────────────────────────
  const loadProductIntoForm = useCallback(async (product: Product) => {
    setIsLoadingModalData(true);
    try {
      const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.imageUrl ? [product.imageUrl] : [];

      setFormData({
        id: product.id ?? "",
        name: product.name ?? "",
        slug: product.slug ?? "",
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        price: product.price ?? 0,
        imageUrl: "",
        images,
        categoryId: product.categoryId ?? "",
        selectedOptionValueIds: [],
      });

      if (product.categoryId) {
        const selectedIds: number[] = [];
        (product.options ?? []).forEach(opt => {
          if (!("optionValues" in opt)) return;
          opt.optionValues.forEach(optVal => {
            filters.forEach(filter => {
              filter.optionValues.forEach(fv => {
                if (fv.value === optVal.value) selectedIds.push(fv.id);
              });
            });
          });
        });
        setFormData(prev => ({ ...prev, selectedOptionValueIds: selectedIds }));
      }
    } catch {
      toast.error("Failed to load product details");
    } finally {
      setIsLoadingModalData(false);
    }
  }, [loadOptionsForCategory]);

  const handleModalCategoryChange = useCallback((categoryId: number) => {
    updateField("categoryId", categoryId);
    updateField("selectedOptionValueIds", []);
    if (categoryId) loadOptionsForCategory(categoryId);
  }, [updateField, loadOptionsForCategory]);

  // ────────────────────────────────────────────────────────────────
  // Public modal actions
  // ────────────────────────────────────────────────────────────────
  const openCreateForm = useCallback(() => {
    resetForm();
    clearFilters();
    setEditingId(null);
    setIsViewMode(false);
    setShowForm(true);
  }, [resetForm]);

  const openEditForm = useCallback(async (product: Product) => {
    await loadProductIntoForm(product);
    setEditingId(Number(product.id));
    setIsViewMode(false);
    setShowForm(true);
  }, [loadProductIntoForm]);

  const openViewForm = useCallback(async (product: Product) => {
    await loadProductIntoForm(product);
    setEditingId(Number(product.id));
    setIsViewMode(true);
    setShowForm(true);
  }, [loadProductIntoForm]);

  const closeForm = useCallback(() => {
    resetForm();
    setShowForm(false);
    setEditingId(null);
    setIsViewMode(false);
    clearFilters();
  }, [resetForm]);

  return {
    showForm,
    editingId,
    isViewMode,
    isLoadingModalData,
    handleModalCategoryChange,
    openCreateForm,
    openEditForm,
    openViewForm,
    closeForm,
  };
};
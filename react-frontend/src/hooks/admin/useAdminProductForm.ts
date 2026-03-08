// THIS IS A CUSTOM HOOK FOR MANAGING THE STATE AND BEHAVIOR OF THE ADMIN PRODUCT MODAL

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { categoryApi } from "../../api/products/categoryApi";
import type { ProductOption } from "../../types/models/products/ProductOption";

interface UseAdminProductFormReturn {
  showForm: boolean;
  editingId: number | null;
  isViewMode: boolean;
  currentCategoryFilters: ProductOption[];
  filtersLoading: boolean;
  setShowForm: (show: boolean) => void;
  openCreateForm: () => void;
  openEditForm: (id: number) => void;
  openViewForm: (id: number) => void;
  closeForm: () => void;
  loadOptionsForCategory: (categoryId: number) => Promise<ProductOption[]>;
  clearFilters: () => void;
}

export const useAdminProductForm = (): UseAdminProductFormReturn => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentCategoryFilters, setCurrentCategoryFilters] = useState<ProductOption[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const openCreateForm = useCallback(() => {
    setEditingId(null);
    setIsViewMode(false);
    setShowForm(true);
  }, []);

  const openEditForm = useCallback((id: number) => {
    setEditingId(id);
    setIsViewMode(false);
    setShowForm(true);
  }, []);

  const openViewForm = useCallback((id: number) => {
    setEditingId(id);
    setIsViewMode(true);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setIsViewMode(false);
  }, []);

  const loadOptionsForCategory = useCallback(
    async (categoryId: number): Promise<ProductOption[]> => {
      if (!categoryId || categoryId <= 0) {
        setCurrentCategoryFilters([]);
        return [];
      }

      setFiltersLoading(true);

      try {
        console.log("[useProductModal] Loading options for category:", categoryId);
        const data = await categoryApi.getFiltersById(categoryId);
        const filters = Array.isArray(data) ? data : (data?.data || []);
        
        // Validate filter structure
        const validFilters = filters.filter(
          (o: ProductOption) =>
            o.optionId &&
            o.name &&
            Array.isArray(o.optionValues)
        );

        console.log("[useProductModal] Loaded filters:", validFilters);
        setCurrentCategoryFilters(validFilters);
        return validFilters;
      } catch (error) {
        console.error("[useProductModal] Error loading filters:", error);
        toast.error("Failed to load product attributes");
        setCurrentCategoryFilters([]);
        return [];
      } finally {
        setFiltersLoading(false);
      }
    },
    []
  );

  const clearFilters = useCallback(() => {
    setCurrentCategoryFilters([]);
  }, []);

  return {
    showForm,
    editingId,
    isViewMode,
    currentCategoryFilters,
    filtersLoading,
    setShowForm,
    openCreateForm,
    openEditForm,
    openViewForm,
    closeForm,
    loadOptionsForCategory,
    clearFilters,
  };
};

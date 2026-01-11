import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { filterApi } from "../../api/products/filterApi";
import type { ProductOption } from "../../types/models/ProductOption";

interface UseProductModalReturn {
  showForm: boolean;
  editingId: number | null;
  expandedProduct: number | null;
  currentCategoryFilters: ProductOption[];
  filtersLoading: boolean;
  setShowForm: (show: boolean) => void;
  openCreateForm: () => void;
  openEditForm: (id: number) => void;
  closeForm: () => void;
  toggleExpandProduct: (id: number) => void;
  loadOptionsForCategory: (categoryId: number) => Promise<ProductOption[]>;
  clearFilters: () => void;
}

export const useProductModal = (): UseProductModalReturn => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [currentCategoryFilters, setCurrentCategoryFilters] = useState<ProductOption[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const openCreateForm = useCallback(() => {
    setEditingId(null);
    setShowForm(true);
  }, []);

  const openEditForm = useCallback((id: number) => {
    setEditingId(id);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
  }, []);

  const toggleExpandProduct = useCallback((id: number) => {
    setExpandedProduct((prev) => (prev === id ? null : id));
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
        const data = await filterApi.getFiltersByCategoryId(categoryId);
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
    expandedProduct,
    currentCategoryFilters,
    filtersLoading,
    setShowForm,
    openCreateForm,
    openEditForm,
    closeForm,
    toggleExpandProduct,
    loadOptionsForCategory,
    clearFilters,
  };
};

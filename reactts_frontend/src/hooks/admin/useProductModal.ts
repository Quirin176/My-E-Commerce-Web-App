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
  loadFiltersForCategory: (categoryId: number) => Promise<void>;
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

  const loadFiltersForCategory = useCallback(async (categoryId: number) => {
    if (!categoryId || categoryId <= 0) {
      setCurrentCategoryFilters([]);
      return;
    }

    setFiltersLoading(true);

    try {
      const data = await filterApi.getFiltersByCategoryId(categoryId);
      const filters = Array.isArray(data) ? data : (data?.data || []);
      
      // Validate filter structure
      const validFilters = filters.filter(
        (f) =>
          f.optionId &&
          f.name &&
          Array.isArray(f.optionValues)
      );

      setCurrentCategoryFilters(validFilters);
    } catch (error) {
      console.error("Error loading filters:", error);
      toast.error("Failed to load product attributes");
      setCurrentCategoryFilters([]);
    } finally {
      setFiltersLoading(false);
    }
  }, []);

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
    loadFiltersForCategory,
    clearFilters,
  };
};

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { filterApi } from "../../api/products/filterApi";
import type { ProductOption } from "../../types/models/ProductOption";

interface UseProductModalReturn {
  // Modal States
  showForm: boolean;
  editingId: number | null;
  expandedProduct: number | null;

  // Filter Data
  currentCategoryFilters: ProductOption[];
  filtersLoading: boolean;
  filtersError: string | null;
  
  // State Setters
  setShowForm: (show: boolean) => void;
  setEditingId: (id: number | null) => void;
  setExpandedProduct: (id: number | null) => void;
  openCreateForm: () => void;
  openEditForm: (id: number) => void;
  closeForm: () => void;
  toggleExpandProduct: (id: number) => void;
  
  // Filter Loaders
  loadFiltersForCategory: (categoryId: number) => Promise<void>;
  clearFilters: () => void;
}

export const useProductModal = (): UseProductModalReturn => {

  // Modal States
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  // Filter States
  const [currentCategoryFilters, setCurrentCategoryFilters] = useState<ProductOption[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [filtersError, setFiltersError] = useState<string | null>(null);

  // Modal Handlers
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

  // Filter Handlers
  const loadFiltersForCategory = useCallback(async (categoryId: number) => {
    if (!categoryId) {
      setCurrentCategoryFilters([]);
      return;
    }

    setFiltersLoading(true);
    setFiltersError(null);

    try {
      console.debug("Loading filters for category ID:", categoryId);
      const filtersData = await filterApi.getFiltersByCategoryId(categoryId);

      // Ensure filtersData.data is an array
      const filters = Array.isArray(filtersData.data) ? filtersData.data : [];

      setCurrentCategoryFilters(filters);
      console.debug("Loaded filters:", filters);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error loading filters:", errorMessage);
      setFiltersError(errorMessage);
      toast.error(errorMessage);
      console.error("Error loading filters:", error);
      setCurrentCategoryFilters([]);
    } finally {
      setFiltersLoading(false);
    }
  }, []);

  const clearFilters = useCallback(() => {
    setCurrentCategoryFilters([]);
    setFiltersError(null);
  }, []);

  return {
    // Modal States
    showForm,
    editingId,
    expandedProduct,

    // Filter States
    currentCategoryFilters,
    filtersLoading,
    filtersError,

    // Modal Handlers
    setShowForm,
    setEditingId,
    setExpandedProduct,
    openCreateForm,
    openEditForm,
    closeForm,
    toggleExpandProduct,

    // Filter Handlers
    loadFiltersForCategory,
    clearFilters,
  };
};

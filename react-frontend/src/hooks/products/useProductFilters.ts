import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { categoryApi } from "../../api/products/categoryApi";
import type { ProductOption } from "../../types/models/products/ProductOption";

interface UseProductFiltersReturn {
  filters: ProductOption[];
  filtersLoading: boolean;
  loadOptionsForCategory: (categoryId: number) => Promise<ProductOption[]>;
  clearFilters: () => void;
}
 
export const useProductFilters = (): UseProductFiltersReturn => {
  const [filters, setFilters] = useState<ProductOption[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(false);
 
  const loadOptionsForCategory = useCallback(async (categoryId: number): Promise<ProductOption[]> => {
    if (!categoryId || categoryId <= 0) {
      setFilters([]);
      return [];
    }
 
    setFiltersLoading(true);
    try {
      const data = await categoryApi.getAllChildDataByCategoryId(categoryId);
      const raw = Array.isArray(data) ? data : (data?.data ?? []);
      const valid: ProductOption[] = raw.filter(
        (o: ProductOption) => o.optionId && o.optionName && Array.isArray(o.optionValues)
      );
      setFilters(valid);
      return valid;
    } catch {
      toast.error("Failed to load product attributes");
      setFilters([]);
      return [];
    } finally {
      setFiltersLoading(false);
    }
  }, []);
 
  const clearFilters = useCallback(() => setFilters([]), []);
 
  return { filters, filtersLoading, loadOptionsForCategory, clearFilters };
};
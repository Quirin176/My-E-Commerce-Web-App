import { useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { categoryApi } from "../../api/products/categoryApi";
import type { ProductOption } from "../../types/models/products/Product";

export interface UserProductFiltersReturn {
  filters: ProductOption[];
  filtersLoading: boolean;
  loadFilters: (categoryId: number) => Promise<ProductOption[]>;
  setFilters: React.Dispatch<React.SetStateAction<ProductOption[]>>;
}

export const useProductFilters = (): UserProductFiltersReturn => {
  const [filters, setFilters] = useState<ProductOption[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const loadFilters = useCallback(async (categoryId: number): Promise<ProductOption[]> => {
    if (!categoryId) {
      setFilters([]);
      setFiltersLoading(false);
      return [];
    }

    setFiltersLoading(true);
    try {
      const res = await categoryApi.getAllChildDataByCategoryId(categoryId);
      const raw = Array.isArray(res) ? res : res?.data ?? [];

      setFilters(raw);
      return raw;
    } catch {
      toast.error("Failed to load filters");
      setFilters([]);
      return [];
    } finally {
      setFiltersLoading(false);
    }
  }, []);

  return useMemo(
    () => ({ filters, filtersLoading, loadFilters, setFilters }),
    [filters, filtersLoading, loadFilters, setFilters]
  );
};
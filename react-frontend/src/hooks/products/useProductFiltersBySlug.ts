import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { categoryApi } from "../../api/products/categoryApi";
import type { ProductOption } from "../../types/models/products/ProductOption";

export const useProductFiltersBySlug = () => {
  const [filters, setFilters] = useState<ProductOption[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const loadFilters = useCallback(async (categorySlug: string): Promise<ProductOption[]> => {
    if (!categorySlug) {
      setFilters([]);
      return [];
    }

    setFiltersLoading(true);
    try {
      const res = await categoryApi.getAllChildDataByCategorySlug(categorySlug);
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

  return {
    filters,
    filtersLoading,
    loadFilters,
    setFilters,
  };
};
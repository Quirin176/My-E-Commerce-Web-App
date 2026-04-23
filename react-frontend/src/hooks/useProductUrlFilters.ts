import { useUrlFilters } from "./useUrlFilters";

export function useProductUrlFilters() {
  return useUrlFilters({
    category: "",
    page: 1,
    sortBy: "newest",
    sortOrder: "desc",
    search: "",
    minPrice: "0",
    maxPrice: "100000000",
    selectedOptions: [] as (string | number)[],
  });
}
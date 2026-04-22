import { useUrlFilters } from "./useUrlFilters";

export function useProductUrlFilters() {
  return useUrlFilters({
    page: 1,
    sortBy: "newest",
    sortOrder: "desc",
    query: "",
    minPrice: "0",
    maxPrice: "100000000",
    selectedOptions: [] as (string | number)[],
  });
}
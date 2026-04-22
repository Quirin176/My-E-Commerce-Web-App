import { useUrlFilters } from "./useUrlFilters";

export function useUserUrlFilters() {
  return useUrlFilters({
    page: 1,
    sortBy: "Id",
    sortOrder: "asc",
    search: "",
    role: "",
  });
}
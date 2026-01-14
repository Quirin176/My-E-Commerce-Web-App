// import { useCallback, useState } from "react";
// import toast from "react-hot-toast";
// import { filterApi } from "../api/products/filterApi";
// import type { ProductOption } from "../types/models/ProductOption";

// interface UseProductFiltersReturn {
//     filters: ProductOption[];
//     loading: boolean;
//     error: string | null;
//     loadFiltersByCategory: (categoryId: number) => Promise<void>;
//     clearFilters: () => void;
// }

// export const useProductFilters = (): UseProductFiltersReturn => {
//     const [filters, setFilters] = useState<ProductOption[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const loadFiltersByCategory = useCallback(async (categoryId: number) => {
//         if (!categoryId) {
//             setFilters([]);
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             console.debug("[useProductFilters] Loading filters for category:", categoryId);
//             const filtersData = await filterApi.getFiltersByCategoryId(categoryId);
//             setFilters(Array.isArray(filtersData) ? filtersData : []);
//             console.debug("[useProductFilters] Filters loaded:", filtersData);
//         } catch (err: unknown) {
//             const errorMessage = err instanceof Error ? err.message : "Failed to load filters";
//             setError(errorMessage);
//             toast.error(errorMessage);
//             console.error("[useProductFilters] Error:", err);
//             setFilters([]);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const clearFilters = useCallback(() => {
//         setFilters([]);
//         setError(null);
//     }, []);

//     return { filters, loading, error, loadFiltersByCategory, clearFilters };
// };

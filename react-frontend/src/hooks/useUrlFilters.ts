import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export interface UrlFilterState {
  page: number;
  sortOrder: string;
  minPrice: string;
  maxPrice: string;
  selectedOptions: (string | number)[];
  query: string;
}

interface UseUrlFiltersReturn extends UrlFilterState {
  updateUrl: (overrides: Partial<UrlFilterState>) => void;
}

/** Parses a comma-separated options string into a typed array. */
function parseOptions(raw?: string | null): (string | number)[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => (isNaN(Number(v)) ? v : Number(v)));
}

export function useUrlFilters(): UseUrlFiltersReturn {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const sortOrder = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice") ?? "0";
  const maxPrice = searchParams.get("maxPrice") ?? "100000000";
  const query = searchParams.get("query") || "";
  const optionsRaw = searchParams.get("options") || searchParams.get("filter") || "";
  const selectedOptions = useMemo(() => parseOptions(optionsRaw), [optionsRaw]);  // useMemo to avoid re-parsing on every render

  const updateUrl = useCallback(
    (overrides: Partial<UrlFilterState>) => {
      const next: UrlFilterState = {
        page,
        sortOrder,
        minPrice,
        maxPrice,
        selectedOptions,
        query,
        ...overrides,
      };

      // Build new search params - Example: ?query=phone&page=2&sort=ascending&minPrice=100&maxPrice=1000&options=red,blue
      const params = new URLSearchParams();
      if (next.query) params.set("query", next.query);
      if (next.page > 1) params.set("page", String(next.page));
      if (next.sortOrder && next.sortOrder !== "newest") params.set("sort", next.sortOrder);
      if (next.selectedOptions.length > 0) params.set("options", next.selectedOptions.map(String).join(","));
      if (next.minPrice !== "0") params.set("minPrice", next.minPrice);
      if (next.maxPrice !== "100000000") params.set("maxPrice", next.maxPrice);

      const search = params.toString();
      navigate({ search: search ? `?${search}` : "" }, { replace: true });
    },
    [navigate, page, sortOrder, minPrice, maxPrice, selectedOptions]
  );

  return { page, sortOrder, minPrice, maxPrice, selectedOptions, query, updateUrl };
}
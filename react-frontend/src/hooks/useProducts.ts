import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { productApi } from "../api/products/productApi";
import { categoryApi } from "../api/products/categoryApi";
import type { Product } from "../types/models/products/Product";
import type { ProductOption } from "../types/models/products/ProductOption";

interface UseProductsOptions {
  categorySlug: string | undefined;
  pageSize: number;
}

interface FilterParams {
  minPrice: string | number;
  maxPrice: string | number;
  sortOrder: string;
  selectedOptions: (string | number)[];
  currentPage: number;
}

interface UseProductsReturn {
  products: Product[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  loadedOptions: ProductOption[];
  refetch: () => void;
}

export function useProducts({ categorySlug, pageSize }: UseProductsOptions, filters: FilterParams): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadedOptions, setLoadedOptions] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState(0);

  const abortRef = useRef<AbortController | null>(null);

  const optionsKey = filters.selectedOptions.map(String).join(",");

  // ── Fetch products ──────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await productApi.getProductsPaginated(
        filters.currentPage,
        pageSize, "", "id", filters.sortOrder, {
        category: categorySlug || undefined,
        minPrice: Number(filters.minPrice) || undefined,
        maxPrice: Number(filters.maxPrice) || undefined,
        options: filters.selectedOptions.length > 0 ? filters.selectedOptions : undefined,
        sortOrder: filters.sortOrder as "newest" | "oldest" | "ascending" | "descending",}
      );

      const list: Product[] = Array.isArray(response.data) ? response.data : [];

      if (!Array.isArray(list)) throw new Error("Unexpected API response shape");

      setProducts(list);
      setTotalCount(response.pagination.totalCount);

      setError(null);
    } catch (err) {
      // Ignore aborted requests
      if (err instanceof DOMException && err.name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "Failed to load products";
      setError(message);
      toast.error(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, pageSize, filters.currentPage, filters.minPrice, filters.maxPrice, filters.sortOrder, optionsKey]);

  useEffect(() => {
    fetchProducts();
    return () => abortRef.current?.abort();
  }, [fetchProducts]);

  // ── Fetch category options once per slug ────────────────────────────────────
  useEffect(() => {
    if (!categorySlug) {
      setLoadedOptions([]);
      return;
    }

    let cancelled = false;

    categoryApi.getAllChildDataByCategorySlug(categorySlug).then((res) => {
        if (!cancelled) setLoadedOptions(Array.isArray(res) ? res : []);
      }).catch(() => {
        if (!cancelled) {
          toast.error("Failed to load category filters");
          setLoadedOptions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return {
    products,
    totalCount: totalCount,
    loading,
    error,
    loadedOptions,
    refetch: fetchProducts,
  };
}
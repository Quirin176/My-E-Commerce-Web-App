import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { productApi } from "../api/products/productApi";
import type { Product } from "../types/models/products/Product";
import type { SearchFilters } from "../api/products/productApi";

interface UserProductsSearchOptions {
    query: string;
    currentPage: number;
    pageSize: number;
}

interface UseProductsSearchReturn {
    products: Product[];
    totalCount: number;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useProductSearch({ query, currentPage, pageSize }: UserProductsSearchOptions, { minPrice, maxPrice, sortOrder }: SearchFilters): UseProductsSearchReturn {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [totalCount, setTotalCount] = useState(0);

    const abortRef = useRef<AbortController | null>(null);

    // ── Fetch products ──────────────────────────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        // Don't fetch if query is empty
        if (!query.trim()) {
            setProducts([]);
            setTotalCount(0);
            return;
        }

        // Cancel any in-flight request
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            const response = await productApi.search(query, currentPage, pageSize, { minPrice, maxPrice, sortOrder });
            const list: Product[] = Array.isArray(response.products) ? response.products : [];

            if (!Array.isArray(list)) throw new Error("Unexpected API response shape");

            setProducts(list);
            setTotalCount(response.totalCount);

            setError(null);
        } catch (err) {
            // Ignore aborted requests
            if (err instanceof DOMException && err.name === "AbortError") return;
            const message = err instanceof Error ? err.message : "Failed to load products";
            setError(message);
            toast.error(message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [query, currentPage,pageSize, minPrice, maxPrice, sortOrder]);

    useEffect(() => {
        fetchProducts();
        return () => abortRef.current?.abort();
    }, [fetchProducts]);

    return {
        products,
        totalCount: totalCount,
        loading,
        error,
        refetch: fetchProducts,
    };
}
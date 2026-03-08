import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Category } from "../types/models/products/Category"
import { categoryApi } from "../api/products/categoryApi";

interface UseCategoriesReturn {
    categories: Category[];
    loading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.debug("[useCategories] Fetching categories");
            const data = await categoryApi.getAll();
            setCategories(Array.isArray(data) ? data : []);
            console.debug("[useCategories] Categories loaded:", data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch categories";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error("[useCategories] Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, error, fetchCategories };
};

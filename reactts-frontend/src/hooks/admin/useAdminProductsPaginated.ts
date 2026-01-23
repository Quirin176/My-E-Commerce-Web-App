// THIS IS A CUSTOM HOOK FOR MANAGING PAGINATED ADMIN PRODUCTS WITH FILTERING, SEARCHING, CREATING, UPDATING, AND DELETING FUNCTIONALITIES

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminProductsApi, type UpdatedProductPayload } from "../../api/admin/adminProductsApi";
import type { Product } from "../../types/models/Product";

interface FilterOptions {
  categoryName?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface UseAdminProductsPaginatedReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  
  // Filter states
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  
  // Functions
  fetchProducts: (page: number, search?: string) => Promise<void>;
  goToPage: (page: number) => void;
  searchProducts: (search: string) => Promise<void>;
  applyFilters: (newFilters: FilterOptions) => Promise<void>;
  clearFilters: () => void;
  createProduct: (data: UpdatedProductPayload) => Promise<void>;
  updateProduct: (id: number, data: UpdatedProductPayload) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const PAGE_SIZE = 10;
const DEFAULT_FILTERS: FilterOptions = {
  categoryName: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: "id",
  sortOrder: "desc",
};

export const useAdminProductsPaginated = (): UseAdminProductsPaginatedReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(PAGE_SIZE);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  // Fetch products with pagination and filters
  const fetchProducts = useCallback(
    async (page: number = 1, search: string = "") => {
      setLoading(true);
      setError(null);

      try {
        console.debug(`[useAdminProductsPaginated] Fetching page ${page}, search: "${search}", filters:`, filters);
        
        const response = await adminProductsApi.getProductsPaginated(
          page,
          PAGE_SIZE,
          search || undefined,
          filters.sortBy || "id",
          filters.sortOrder || "desc"
        );

        setProducts(Array.isArray(response.data) ? response.data : []);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);
        setHasNextPage(response.pagination.hasNextPage);
        setHasPreviousPage(response.pagination.hasPreviousPage);

        console.debug(`[useAdminProductsPaginated] Loaded ${response.data.length} products`);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("[useAdminProductsPaginated] Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Apply filters and reset to page 1
  const applyFilters = useCallback(
    async (newFilters: FilterOptions) => {
      console.debug("[useAdminProductsPaginated] Applying filters:", newFilters);
      setFilters(newFilters);
      setCurrentPage(1);
      await fetchProducts(1, searchTerm);
    },
    [fetchProducts, searchTerm]
  );

  // Clear all filters
  const clearFilters = useCallback(async () => {
    console.debug("[useAdminProductsPaginated] Clearing filters");
    setFilters(DEFAULT_FILTERS);
    setSearchTerm("");
    setCurrentPage(1);
    await fetchProducts(1, "");
  }, [fetchProducts]);

  // Go to page
  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      fetchProducts(page, searchTerm);
    },
    [totalPages, searchTerm, fetchProducts]
  );

  // Search products
  const searchProducts = useCallback(
    async (search: string) => {
      setSearchTerm(search);
      fetchProducts(1, search); // Reset to page 1 when searching
    },
    [fetchProducts]
  );

  // Create product (refresh current page)
  const createProduct = useCallback(
    async (data: UpdatedProductPayload) => {
      try {
        await adminProductsApi.createProduct(data);
        toast.success("Product created successfully!");
        // Refresh current page
        await fetchProducts(currentPage, searchTerm);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create product";
        toast.error(errorMessage);
        throw error;
      }
    },
    [currentPage, searchTerm, fetchProducts]
  );

  // Update product (refresh current page)
  const updateProduct = useCallback(
    async (id: number, data: UpdatedProductPayload) => {
      try {
        await adminProductsApi.updateProductById(id, data);
        toast.success("Product updated successfully!");
        // Refresh current page
        await fetchProducts(currentPage, searchTerm);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update product";
        toast.error(errorMessage);
        throw error;
      }
    },
    [currentPage, searchTerm, fetchProducts]
  );

  // Delete product (refresh - might go back a page)
  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        await adminProductsApi.deleteProduct(id);
        toast.success("Product deleted successfully!");
        
        // If we're on the last page and it was the last item, go back one page
        if (products.length === 1 && currentPage > 1) {
          await fetchProducts(currentPage - 1, searchTerm);
        } else {
          // Otherwise refresh current page
          await fetchProducts(currentPage, searchTerm);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete product";
        toast.error(errorMessage);
        throw error;
      }
    },
    [products.length, currentPage, searchTerm, fetchProducts]
  );

  // Load products on mount
  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    filters,
    setFilters,
    fetchProducts,
    goToPage,
    searchProducts,
    applyFilters,
    clearFilters,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

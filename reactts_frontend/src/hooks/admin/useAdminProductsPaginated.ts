import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminProductsApi, type PaginatedResponse } from "../../api/admin/adminProductsApi";
import type { Product } from "../../types/models/Product";

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
  
  // Functions
  fetchProducts: (page: number, search?: string) => Promise<void>;
  goToPage: (page: number) => void;
  searchProducts: (search: string) => Promise<void>;
  createProduct: (data: Product) => Promise<void>;
  updateProduct: (id: number, data: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const PAGE_SIZE = 10;

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

  // Fetch products with pagination
  const fetchProducts = useCallback(
    async (page: number = 1, search: string = "") => {
      setLoading(true);
      setError(null);

      try {
        console.debug(`[useAdminProductsPaginated] Fetching page ${page}, search: "${search}"`);
        
        const response = await adminProductsApi.getProductsPaginated(
          page,
          PAGE_SIZE,
          search || undefined
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
    []
  );

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
    async (data: Product) => {
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
    async (id: number, data: Product) => {
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
    fetchProducts,
    goToPage,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

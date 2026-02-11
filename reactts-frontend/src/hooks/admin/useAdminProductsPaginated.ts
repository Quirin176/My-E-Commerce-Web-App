// THIS IS A CUSTOM HOOK FOR MANAGING PAGINATED ADMIN PRODUCTS WITH FILTERING, SEARCHING, CREATING, UPDATING, AND DELETING FUNCTIONALITIES

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminProductsApi, type UpdatedProductPayload } from "../../api/admin/adminProductsApi";
import type { Product } from "../../types/models/products/Product";

export const useAdminProductsPaginated = (
  ITEMS_PER_PAGE: number,
  minPrice: string | number,
  maxPrice: string | number,
  sortOrder: string,
  selectedCategory?: string | null,
  selectedOptions?: (string|number)[]
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // API load products with pagination, search, and filters
  const fetchProducts = useCallback(async (page: number = 1, search: string = "") => {
      setLoading(true);
      setError(null);

      try {
        // console.log(`[useAdminProductsPaginated] Fetching page ${page}, search: "${search}", filters:`, filters);
        // console.log("[useAdminProductsPaginated] Recent filters category: ", selectedCategory, ", minPrice: ", minPrice, ", maxPrice: ", maxPrice, ", sortOrder: ", sortOrder);
        
        const filters = {
        category: selectedCategory || undefined,
        minPrice: Number(minPrice) || undefined,
        maxPrice: Number(maxPrice) || undefined,
        options: selectedOptions && selectedOptions.length > 0 ? selectedOptions : undefined,
        sortOrder: sortOrder as "newest" | "oldest" | "ascending" | "descending"
      };

        const response = await adminProductsApi.getProductsPaginated(
          page,
          ITEMS_PER_PAGE,
          search || undefined,
          "id",
          sortOrder,
          filters
        );

        setProducts(Array.isArray(response.data) ? response.data : []);
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);

        // console.log(`[useAdminProductsPaginated] Loaded ${response.data.length} products`);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("[useAdminProductsPaginated] Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [ITEMS_PER_PAGE, minPrice, maxPrice, sortOrder, selectedCategory, selectedOptions]
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
    fetchProducts,
    goToPage,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

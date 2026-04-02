import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { productApi } from "../../api/products/productApi";
import { adminProductsApi, type UpdatedProductPayload } from "../../api/admin/adminProductsApi";
import type { Product } from "../../types/models/products/Product";

export interface ProductListOptions {
  pageSize?: number,
  minPrice?: string | number,
  maxPrice?: string | number,
  sortOrder?: string,
  category?: string | null,
  options?: (string | number)[]
}

export const useAdminProductsPaginated = (opts: ProductListOptions = {}) => {
  const {
    pageSize: ITEMS_PER_PAGE = 10,
    minPrice = 0,
    maxPrice = 100_000_000,
    sortOrder = "newest",
    category: selectedCategory = null,
    options: selectedOptions = [],
  } = opts;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // API load products with pagination, search, and filters
  const fetchProducts = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    setError(null);

    try {
      const filters = {
        category: selectedCategory || undefined,
        minPrice: Number(minPrice) || undefined,
        maxPrice: Number(maxPrice) || undefined,
        options: selectedOptions.length > 0 ? selectedOptions : undefined,
        sortOrder: sortOrder as "newest" | "oldest" | "ascending" | "descending",
      };

      const response = await productApi.getProductsPaginated(page, ITEMS_PER_PAGE, search || undefined, "id", sortOrder, filters);

      setProducts(Array.isArray(response.data) ? response.data : []);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.totalCount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  },
    [ITEMS_PER_PAGE, minPrice, maxPrice, sortOrder, selectedCategory, selectedOptions]
  );

  // Go to page
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchProducts(page, searchTerm);
  }, [totalPages, searchTerm, fetchProducts]);

  // Search products
  const searchProducts = useCallback((search: string) => {
    setSearchTerm(search);
    fetchProducts(1, search); // Reset to page 1 when searching
  }, [fetchProducts]);

  // Create product (refresh current page)
  const createProduct = useCallback(async (data: UpdatedProductPayload) => {
    await adminProductsApi.createProduct(data);
    toast.success("Product created successfully!");
    await fetchProducts(currentPage, searchTerm); // Refresh current page
  }, [currentPage, searchTerm, fetchProducts]);

  // Update product (refresh current page)
  const updateProduct = useCallback(async (id: number, data: UpdatedProductPayload) => {
    await adminProductsApi.updateProductById(id, data);
    toast.success("Product updated successfully!");
    await fetchProducts(currentPage, searchTerm); // Refresh current page
  }, [currentPage, searchTerm, fetchProducts]);

  // Delete product (refresh - might go back a page)
  const deleteProduct = useCallback(async (id: number) => {
    await adminProductsApi.deleteProduct(id);
    toast.success("Product deleted!");
    const nextPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
    await fetchProducts(nextPage, searchTerm);
  }, [products.length, currentPage, searchTerm, fetchProducts]);

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

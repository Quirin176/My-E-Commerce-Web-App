import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import DynamicFilters from "../../components/Product/DynamicFilters";
import ProductCard from "../../components/Product/ProductCard";
import { productApi } from "../../api/products/productApi";
import { categoryApi } from "../../api/products/categoryApi";
import type { Product } from "../../types/models/Product";
import type { ProductOption } from "../../types/models/ProductOption";

const ITEMS_PER_PAGE = 15;

export default function Category() {
  const { selectedCategory } = useParams<{ selectedCategory: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get("page") || "1"));
  const [totalCount, setTotalCount] = useState<number>(0);

  // Products State - current page's products
  const [products, setProducts] = useState<Product[]>([]);

  // Dynamic filter states
  const [minPrice, setMinPrice] = useState<string | number>("0");
  const [maxPrice, setMaxPrice] = useState<string | number>("100000000");
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get("sort") || "newest");
  const [loadedOptions, setLoadedOptions] = useState<ProductOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Format category name from slug
  const formattedName = selectedCategory ? selectedCategory.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "Products";

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  // API Load products with all filters applied - wrap in useCallback to avoid dependency issues
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      if (!selectedCategory) {
        setProducts([]);
        return;
      }

      // Prepare filter options - ensure they're strings for API consistency
      const optionsString = selectedOptions.length > 0 ? selectedOptions.map(String).join(",") : null;

      const data = await productApi.getByFilters(selectedCategory, {
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 100000000,
        sortOrder,
        options: optionsString,
      });

      // Standardize response handling
      const allProducts = Array.isArray(data) ? data : (data?.products || data?.data || []);

      if (!Array.isArray(allProducts)) {
        throw new Error("Invalid product list format from API");
      }

      // Set total count
      setTotalCount(allProducts.length);

      // Apply pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedProducts = allProducts.slice(startIndex, endIndex);

      setProducts(paginatedProducts);
      setError(null);
    } catch (error) {
      console.error("Error loading products:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load products";
      setError(errorMessage);
      toast.error(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, minPrice, maxPrice, sortOrder, selectedOptions, currentPage]);

  // Load products when any filter or page changes
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // API Load available filters for this category
  useEffect(() => {
    const loadFilters = async () => {
      if (!selectedCategory) {
        setLoadedOptions([]);
        return;
      }

      try {
        const filters = await categoryApi.getFiltersBySlug(selectedCategory);
        const filterList = Array.isArray(filters) ? filters : [];
        setLoadedOptions(filterList);
      } catch (err) {
        console.error("Error loading filters:", err);
        toast.error("Failed to load category filters");
        setLoadedOptions([]);
      }
    };

    loadFilters();
  }, [selectedCategory]);

  // Handle URL filter parameter from dropdown/header navigation
  useEffect(() => {
    const filterParam = searchParams.get("filter");

    if (filterParam) {
      // Validate the parameter is a valid number
      const parsedValue = parseInt(filterParam, 10);
      if (isNaN(parsedValue)) {
        console.warn("Invalid filter parameter in URL:", filterParam);
        return;
      }

      // Check if this option value exists in the filters
      const exists = loadedOptions.some(option => option.optionValues?.some(val => String(val.optionValueId) === String(parsedValue)));

      if (exists && !selectedOptions.map(String).includes(String(parsedValue))) {
        setSelectedOptions([parsedValue]);
        setCurrentPage(1);

        // Clean up URL parameter after setting filter
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("filter");
        navigate(
          {
            search: newParams.toString() ? `?${newParams.toString()}` : "",
          },
          { replace: true }
        );
      }
    }
  }, [searchParams, loadedOptions, selectedOptions, navigate]);

  // Update URL when pagination or sort changes
  const updateUrlParams = useCallback((page: number, sort: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.append("page", String(page));
    if (sort !== "newest") params.append("sort", sort);

    const search = params.toString();
    navigate(
      {
        search: search ? `?${search}` : "",
      },
      { replace: true }
    );
  }, [navigate]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const maxPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    if (newPage < 1 || newPage > maxPages) return;

    setCurrentPage(newPage);
    updateUrlParams(newPage, sortOrder);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sort change: Set price order, reset page and update URL
  const handleSortChange = (newSort: string) => {
    setSortOrder(newSort);
    setCurrentPage(1);
    updateUrlParams(1, newSort);
  };

  // Handle filter change: Set selected options, reset page and update URL
  const handleFilterChange = (newOptions: (string | number)[]) => {
    setSelectedOptions(newOptions);
    setCurrentPage(1);
    updateUrlParams(1, sortOrder);
  };

  // Guard against invalid slug
  if (!selectedCategory) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Category</h1>
        <p className="text-gray-600">The requested category could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{formattedName}</h1>
        {products.length > 0 && (
          <p className="text-gray-600">
            Showing {startIndex} to {endIndex} of {totalCount} product{totalCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Dynamic filters */}
      <DynamicFilters
        loadedOptions={loadedOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={handleFilterChange}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortOrder={sortOrder}
        setSortOrder={handleSortChange}
      />

      {/* Products grid or loading/empty state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => loadProducts()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">No Products Found</h3>
          <p className="text-blue-700 mb-4">
            No products found in <strong>{formattedName}</strong> with the selected filters.
          </p>
          {selectedOptions.length > 0 && (
            <button
              onClick={() => setSelectedOptions([])}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 p-6 bg-white rounded-lg shadow">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Previous page"
              >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {/* First page */}
                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-3 py-2 rounded-lg font-semibold transition ${
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  1
                </button>

                {/* Ellipsis if needed */}
                {currentPage > 3 && (
                  <span className="px-2 py-2 text-gray-400">...</span>
                )}

                {/* Middle pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page > 1 &&
                      page < totalPages &&
                      Math.abs(page - currentPage) <= 1
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg font-semibold transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                {/* Ellipsis if needed */}
                {currentPage < totalPages - 2 && (
                  <span className="px-2 py-2 text-gray-400">...</span>
                )}

                {/* Last page */}
                {totalPages > 1 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-2 rounded-lg font-semibold transition ${
                      currentPage === totalPages
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

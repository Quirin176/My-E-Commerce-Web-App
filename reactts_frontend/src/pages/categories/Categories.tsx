import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DynamicFilters from "../../components/Product/DynamicFilters";
import ProductCard from "../../components/Product/ProductCard";
import { productApi } from "../../api/productApi";
import { filterApi } from "../../api/filterApi";
import type { Product } from "../../types/models/Product";
import type { ProductOption } from "../../types/models/ProductOption";

export default function CategoryProducts() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);

  // State with proper types
  const [minPrice, setMinPrice] = useState<string | number>("0");
  const [maxPrice, setMaxPrice] = useState<string | number>("100000000");
  const [priceOrder, setPriceOrder] = useState<string>("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic filter states
  const [dynamicFilters, setDynamicFilters] = useState<ProductOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<(string | number)[]>([]);

  // Guard against invalid slug
  if (!slug) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Category</h1>
        <p className="text-gray-600">The requested category could not be found.</p>
      </div>
    );
  }

  // Format category name from slug
  const formattedName = slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Load products with all filters applied
  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      // Prepare filter options - ensure they're strings for API consistency
      const optionsString = selectedOptions.length > 0 
        ? selectedOptions.map(String).join(",") 
        : null;

      const data = await productApi.getByFilters(slug, {
        minPrice: Number(minPrice) || 0,
        maxPrice: Number(maxPrice) || 100000000,
        priceOrder,
        options: optionsString,
      });

      // Standardize response handling
      const productList = Array.isArray(data) 
        ? data 
        : (data?.products || data?.data || []);

      if (!Array.isArray(productList)) {
        throw new Error("Invalid product list format from API");
      }

      setProducts(productList);
      setError(null);
    } catch (error: any) {
      // Don't show error if request was cancelled
      if (error.name === "AbortError") {
        return;
      }

      console.error("Error loading products:", error);
      const errorMessage = error?.message || "Failed to load products";
      setError(errorMessage);
      toast.error(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load products when any filter changes
  useEffect(() => {
    loadProducts();
  }, [slug, minPrice, maxPrice, priceOrder, selectedOptions]);

  // Load available filters for this category
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filters = await filterApi.getFiltersByCategory(slug);
        const filterList = Array.isArray(filters) ? filters : [];
        setDynamicFilters(filterList);
      } catch (error) {
        console.error("Error loading filters:", error);
        toast.error("Failed to load category filters");
        setDynamicFilters([]);
      }
    };

    if (slug) {
      loadFilters();
    }
  }, [slug]);

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
      const exists = dynamicFilters.some(option =>
        option.optionValues?.some(
          val => String(val.optionValueId) === String(parsedValue)
        )
      );

      if (exists && !selectedOptions.map(String).includes(String(parsedValue))) {
        setSelectedOptions([parsedValue]);
        
        // Clean up URL parameter after setting filter
        // Create new params without the filter param
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
  }, [searchParams, dynamicFilters, selectedOptions, navigate]);

  // Update URL when filters change (optional - for bookmarking)
  const updateUrlFilters = () => {
    if (selectedOptions.length > 0) {
      const params = new URLSearchParams();
      params.set("filters", selectedOptions.map(String).join(","));
      // Uncomment to enable URL-based filter persistence:
      // navigate(`?${params.toString()}`, { replace: true });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{formattedName}</h1>
        {products.length > 0 && (
          <p className="text-gray-600">
            Showing {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Dynamic filters */}
      <DynamicFilters
        categories={dynamicFilters}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        priceOrder={priceOrder}
        setPriceOrder={setPriceOrder}
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
            onClick={loadProducts}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

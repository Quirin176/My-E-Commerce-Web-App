// Create/Update: src/pages/search/Search.jsx

import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchApi } from "../../api/searchApi";
import ProductCard from "../../components/ProductCard";
import DynamicFilters from "../../components/DynamicFilters";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageParam = parseInt(searchParams.get("page") || "1");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Filter states (matching category products)
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("100000000");
  const [priceOrder, setPriceOrder] = useState("newest");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dynamicFilters, setDynamicFilters] = useState([]);

  // Perform search with filters
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const result = await searchApi.search(
          query,
          pageParam,
          12,
          {
            minPrice: parseFloat(minPrice),
            maxPrice: parseFloat(maxPrice),
            sortBy: priceOrder === "newest" ? "newest" : 
                    priceOrder === "ascending" ? "price_asc" :
                    priceOrder === "descending" ? "price_desc" : "newest",
            options: selectedOptions.length > 0 ? selectedOptions.join(",") : null
          }
        );

        setProducts(result.products || []);
        setPagination({
          totalCount: result.totalCount,
          pageNumber: result.pageNumber,
          pageSize: result.pageSize,
          totalPages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage
        });
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to search products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, pageParam, minPrice, maxPrice, priceOrder, selectedOptions]);

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!query) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">No Search Query</h1>
        <p className="text-gray-600">Please enter a search term in the search bar</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {/* Filters on Top - Using DynamicFilters Component */}
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

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-gray-600">
          {pagination.totalCount} result{pagination.totalCount !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 mt-4">Searching products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No products found matching your search</p>
          <p className="text-gray-400 text-sm mt-2">Try different keywords or filters</p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(pagination.pageNumber - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="flex items-center gap-1 px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    let page;
                    if (pagination.totalPages <= 5) {
                      page = i + 1;
                    } else if (pagination.pageNumber <= 3) {
                      page = i + 1;
                    } else if (pagination.pageNumber >= pagination.totalPages - 2) {
                      page = pagination.totalPages - 4 + i;
                    } else {
                      page = pagination.pageNumber - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded text-sm transition ${
                          page === pagination.pageNumber
                            ? "bg-blue-600 text-white"
                            : "border hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.pageNumber + 1)}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-1 px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Results Summary */}
              <div className="mt-4 text-center text-sm text-gray-600">
                Page {pagination.pageNumber} of {pagination.totalPages} (
                {pagination.totalCount} total)
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

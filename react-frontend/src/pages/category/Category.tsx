import { useParams } from "react-router-dom";
import DynamicFilters from "../../components/MainLayout/Customer/Product/DynamicFilters";
import ProductCard from "../../components/MainLayout/Customer/Product/ProductCard";
import PaginationControl from "../../components/MainLayout/PaginationControl";
import { useUrlFilters } from "../../hooks/useUrlFilters";
import { usePagination } from "../../hooks/usePagination";
import { useProducts } from "../../hooks/useProducts";

const PAGE_SIZE = 10;

export default function Category() {
  const { selectedCategory } = useParams<{ selectedCategory: string }>();

  // ── URL state (reads searchParams, never causes extra renders) ──────────────
  const { page, sortOrder, minPrice, maxPrice, selectedOptions, updateUrl } = useUrlFilters();

  // ── Data fetching ─────────────────────────────────────────────────────────
  const { products, totalCount, loading, error, loadedOptions, refetch } =
    useProducts(
      { categorySlug: selectedCategory, pageSize: PAGE_SIZE },
      { minPrice, maxPrice, sortOrder, selectedOptions, currentPage: page }
    );

  // ── Pagination ────────────────────────────────────────────────────────────
  const { totalPages, goToPage } = usePagination({
    totalCount,
    pageSize: PAGE_SIZE,
    currentPage: page,
    onPageChange: (p) => updateUrl({ page: p }),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSortChange = (newSort: string) =>
    updateUrl({ sortOrder: newSort, page: 1 });

  const handleFilterChange = (newOptions: (string | number)[]) =>
    updateUrl({ selectedOptions: newOptions, page: 1 });

  const handleMinPrice = (val: string | number) =>
    updateUrl({ minPrice: String(val), page: 1 });

  const handleMaxPrice = (val: string | number) =>
    updateUrl({ maxPrice: String(val), page: 1 });

  // ── Guard ─────────────────────────────────────────────────────────────────
  if (!selectedCategory) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Category</h1>
        <p className="text-gray-600">The requested category could not be found.</p>
      </div>
    );
  }

  const formattedName = selectedCategory
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold py-12">{formattedName}</h1>

      <DynamicFilters
        loadedOptions={loadedOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={handleFilterChange}
        minPrice={minPrice}
        setMinPrice={handleMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={handleMaxPrice}
        sortOrder={sortOrder}
        setSortOrder={handleSortChange}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">No Products Found</h3>
          <p className="text-blue-700 mb-4">
            No products in <strong>{formattedName}</strong> match the selected filters.
          </p>
          {selectedOptions.length > 0 && (
            <button
              onClick={() => handleFilterChange([])}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <PaginationControl
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={goToPage}
            showGoTo
          />
        </>
      )}
    </div>
  );
}

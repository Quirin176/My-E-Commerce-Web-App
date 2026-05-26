import { useParams } from "react-router-dom";

import { useProductUrlFilters } from "../../hooks/useProductUrlFilters";
import { usePagination } from "../../hooks/usePagination";
import { useProducts } from "../../hooks/products/useProducts";
import { toTitleCase } from "../../utils/format";

import DynamicFilters from "../../components/products/DynamicFilters";
import ProductCard from "../../components/products/ProductCard";
import PaginationControl from "../../components/PaginationControl";
import LoadingState from "../../components/pageState/LoadingState";
import ErrorState from "../../components/pageState/ErrorState";

const PAGE_SIZE = 10;

export default function Category() {
  const { selectedCategory } = useParams<{ selectedCategory: string }>();

  // ── URL state (reads searchParams, never causes extra renders) ──────────────
  const { page, sortOrder, minPrice, maxPrice, selectedOptions, updateUrl } = useProductUrlFilters();

  // ── Data fetching ─────────────────────────────────────────────────────────
  const { products, totalCount, loading, error, loadedOptions, refetch } =
    useProducts({ categorySlug: selectedCategory, pageSize: PAGE_SIZE }, { searchTerm: "", minPrice, maxPrice, sortOrder, selectedOptions, currentPage: page });

  // ── Pagination ────────────────────────────────────────────────────────────
  const { totalPages, goToPage } = usePagination({
    totalCount,
    pageSize: PAGE_SIZE,
    currentPage: page,
    onPageChange: (p) => updateUrl({ page: p }),
  });

  // ── Guard ─────────────────────────────────────────────────────────────────
  if (!selectedCategory) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Category</h1>
        <p className="text-gray-600">The requested category could not be found.</p>
      </div>
    );
  }

  const formattedName = toTitleCase(selectedCategory);

  if (loading)
    return (
      <LoadingState
        message="Loading products..."
        subMessage="Please wait while we fetch the products."
      />
    );

  if (error)
    return (
      <ErrorState
        title="Unable to load products"
        message={error}
        retry={refetch}
      />
    );

  return (
    <div className="container mx-auto">
      {/* Category Title */}
      <h1 className="text-3xl font-bold py-4">{formattedName}</h1>

      {/* Filters */}
      <DynamicFilters
        loadedOptions={loadedOptions}
        selectedOptions={selectedOptions}
        setSelectedOptions={(newOptions: (string | number)[]) => updateUrl({ selectedOptions: newOptions, page: 1 })}
        minPrice={minPrice}
        setMinPrice={(val: string | number) => updateUrl({ minPrice: String(val), page: 1 })}
        maxPrice={maxPrice}
        setMaxPrice={(val: string | number) => updateUrl({ maxPrice: String(val), page: 1 })}
        sortOrder={sortOrder}
        setSortOrder={(newSort: string) => updateUrl({ sortOrder: newSort, page: 1 })}
      />

      {/* Products Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Control */}
      <PaginationControl
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={goToPage}
        showGoTo
      />
    </div>
  );
}
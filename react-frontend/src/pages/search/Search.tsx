import { useProductSearch } from "../../hooks/products/useProductSearch";
import { useUrlFilters } from "../../hooks/useUrlFilters";
import { usePagination } from "../../hooks/usePagination";
import ProductCard from "../../components/MainLayout/Customer/Product/ProductCard";
import PaginationControl from "../../components/MainLayout/PaginationControl";

const PAGE_SIZE = 10;

export default function Search() {

    // Filters and pagination from URL
    const { query, page, minPrice, maxPrice, sortOrder, updateUrl } = useUrlFilters();

    const { products, totalCount, loading, error, refetch } = useProductSearch(
        { query: query, currentPage: page, pageSize: 10 },
        { minPrice: 0, maxPrice: 100000000, sortOrder: "relevance" });

    const { totalPages, goToPage } = usePagination({
        totalCount,
        pageSize: PAGE_SIZE,
        currentPage: page,
        onPageChange: (p) => updateUrl({ page: p }),
    });

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSortChange = (val: string) =>
        updateUrl({ sortOrder: val, page: 1 });

    const handleMinPrice = (val: string | number) =>
        updateUrl({ minPrice: String(val), page: 1 });

    const handleMaxPrice = (val: string | number) =>
        updateUrl({ maxPrice: String(val), page: 1 });

    const clearFilters = () =>
        updateUrl({ minPrice: "0", maxPrice: "100000000", sortOrder: "relevance", selectedOptions: [], page: 1 });

    // ── No query entered ───────────────────────────────────────────────
    if (!query.trim()) {
        return (
            <div className="container mx-auto py-12 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Products</h1>
                <p className="text-gray-500">Enter a keyword in the search bar above to get started.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold py-6">
                Search Results
                <span className="text-gray-500 font-normal text-xl ml-3">
                    for &ldquo;{query}&rdquo;
                </span>
            </h1>

            {/* ── Filter Bar ── */}
            <div className="bg-white p-3 rounded shadow border mb-4">
                <div className="flex flex-wrap items-center gap-2">

                    {/* Price range */}
                    <div className="flex items-center gap-1">
                        <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Price:</label>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice === "0" ? "" : minPrice}
                            onChange={(e) => handleMinPrice(e.target.value || "0")}
                            className="border p-1.5 rounded w-24 text-xs"
                        />
                        <span className="text-xs text-gray-500">–</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice === "100000000" ? "" : maxPrice}
                            onChange={(e) => handleMaxPrice(e.target.value || "100000000")}
                            className="border p-1.5 rounded w-24 text-xs"
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sortOrder}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="border p-1.5 rounded text-xs min-w-32 bg-white hover:bg-gray-50 transition"
                    >
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest</option>
                        <option value="ascending">Low → High</option>
                        <option value="descending">High → Low</option>
                    </select>

                    {/* Clear */}
                    <button
                        onClick={clearFilters}
                        className="ml-auto text-xs text-red-500 font-semibold hover:underline whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* ── Results ── */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    <p className="text-gray-600 mt-4">Loading products...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Results</h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={refetch}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            ) : (products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <>
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <PaginationControl
                        currentPage={page}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        pageSize={PAGE_SIZE}
                        onPageChange={goToPage}
                        showGoTo
                    />
                </>
            )
            )}
        </div>
    );
}
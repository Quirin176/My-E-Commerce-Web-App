import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../../api/products/productApi";
import ProductCard from "../../components/Product/ProductCard";
import type { Product } from "../../types/models/products/Product";

export default function Search() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("query") || "";

    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(100000000);
    const [sortOrder, setSortOrder] = useState<string>("relevance");

    const loadSearchResults = async () => {
        if (!searchQuery) {
            setProducts([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await productApi.search(searchQuery, 1, 10, {
                minPrice: minPrice,
                maxPrice: maxPrice,
                sortOrder: sortOrder
            });

            if (res.products && Array.isArray(res.products)) {
                setProducts(res.products);
            } else {
                setProducts([]);
            }

            console.log("Search results:", res);
        } catch (error) {
            console.error("Error loading search results:", error);
            setError("Failed to load search results.");
        } finally {
            setLoading(false);
        }
    };

    // Run search whenever query or filters change
    useEffect(() => {
        loadSearchResults();
    }, [searchQuery, minPrice, maxPrice, sortOrder]);

    const clearFilters = () => {
        setMinPrice(0);
        setMaxPrice(100000000);
        setSortOrder("relevance");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-row ml-auto gap-4">
                    <div>
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                            Min Price
                        </label>
                        <input
                            className="border-2 rounded-lg"
                            type="number"
                            placeholder="Min Price"
                            value={minPrice !== null ? minPrice : ""}
                            onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                        />
                    </div>

                    <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                            Max Price
                        </label>
                        <input
                            className="border-2 rounded-lg"
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice !== null ? maxPrice : ""}
                            onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                        />

                    </div>
                    <div>
                        <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
                            Sort By
                        </label>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border-2 rounded-lg">
                            <option value="relevance">Relevance</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>

                    </div>
                </div>

                <button onClick={clearFilters} className="ml-auto w-1/12 border-2 rounded-lg">
                    Clear Filters
                </button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
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
                </>
            )
            )}
        </div>
    );
}
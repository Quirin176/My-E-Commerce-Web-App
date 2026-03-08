import { useState } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "../../api/products/productApi";
import ProductCard from "../../components/Product/ProductCard";
import type { Product } from "../../types/models/products/Product";

export default function Search() {
    const { searchQuery } = useParams<{ searchQuery: string }>();
    const [products, setProducts] = useState<Product[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(100000000);
    const [sortOrder, setSortOrder] = useState<string>("relevance");

    const loadSearchResults = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await productApi.search(searchQuery || "", 1, 10, {
                minPrice: minPrice,
                maxPrice: maxPrice,
                sortOrder: sortOrder
            });
            setProducts(res.products);
        } catch (error) {
            console.error("Error loading search results:", error);
            setError("Failed to load search results.");
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setMinPrice(0);
        setMaxPrice(100000000);
        setSortOrder("relevance");
        loadSearchResults();
    }

    return (
        <div>
            <h1>Search</h1>
            <div className="">
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice !== null ? minPrice : ""}
                    onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice !== null ? maxPrice : ""}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                />
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
                <button onClick={clearFilters}>Clear Filters</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <h2>Search Results</h2>
                    {products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
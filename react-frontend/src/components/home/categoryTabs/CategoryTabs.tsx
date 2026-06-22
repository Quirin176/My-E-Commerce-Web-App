import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "../../../hooks/products/useCategories";
import { useCategoryTab } from "../../../hooks/home/categoryTabs/useCategoryTabs";
import ProductCard from "../../products/ProductCard";
import type { Product } from "../../../types/models/products/Product";

interface CategoryTabsProps {
    title: string;
    fetchProducts: (categoryId: number, limit: number) => Promise<Product[]>;
    productsPerPage: number;
    numberOfTabs: number;
}

export default function CategoryTabs({
    title,
    fetchProducts,
    productsPerPage,
    numberOfTabs
}: CategoryTabsProps) {
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

    const [activeTab, setActiveTab] = useState<number>();
    const [pageIndex, setPageIndex] = useState(0);

    const { products, productsLoading, } = useCategoryTab({
        activeTab,
        productsPerPage,
        numberOfTabs,
        fetchProducts,
    });

    // Set first category as default tab once loaded
    useEffect(() => {
        if (categories.length > 0 && !activeTab) {
            setActiveTab(categories[0].id);
        }
    }, [categories, activeTab]);

    // Reset page when tab changes
    useEffect(() => {
        setPageIndex(0);
    }, [activeTab]);

    // Pagination logic
    const start = pageIndex * productsPerPage;
    const paginatedItems = products.slice(start, start + productsPerPage);

    const canNext = start + productsPerPage < products.length;
    const canPrev = pageIndex > 0;

    // Render loading / error states
    if (productsLoading || categoriesLoading) {
        return (
            <div className="bg-(--brand-primary)" style={{ borderRadius: 10, width: "100%", maxWidth: 1200, margin: "0 auto", textAlign: "center", paddingBottom: 10 }}>
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p style={{ color: "white", marginTop: 16 }}>Loading categories...</p>
            </div>
        );
    }

    if (categoriesError) {
        return (
            <div className="bg-(--brand-primary)" style={{ borderRadius: 10, width: "100%", maxWidth: 1200, margin: "0 auto", textAlign: "center", paddingBottom: 10 }}>
                <p style={{ color: "white", fontSize: 18 }}>
                    {categoriesError || "No categories available"}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full rounded-2xl">
            <h2 className="text-4xl font-bold my-8 text-center text-(--text-primary)">{title}</h2>
            {/* <p className="text-4xl font-bold my-8 text-center text-(--text-primary)">Newest Products</p> */}

            {/* CATEGORY TABS */}
            <div className="flex justify-start rounded-t-2xl">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setActiveTab(cat.id);
                            setPageIndex(0);
                        }}
                        className={`min-w-38 rounded-t-2xl cursor-pointer px-2 py-4 text-2xl font-bold ${activeTab === cat.id ?
                            "text-(--text-secondary) bg-(--brand-primary)" : "text-(--text-primary)"}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* PRODUCTS LIST */}
            {productsLoading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, padding: 10, minHeight: 400 }}>
                    <div style={{ gridColumn: "1 / -1", padding: 40, textAlign: "center" }}>
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <p style={{ color: "white", marginTop: 12 }}>Loading products...</p>
                    </div>
                </div>
            ) : (
                <div className="bg-linear-to-br from-(--brand-primary) to-(--brand-secondary)">
                    {/* PRODUCTS DISPLAY */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
                        {paginatedItems.length > 0 ? (
                            paginatedItems.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))
                        ) : (
                            <div style={{ gridColumn: "1 / -1", padding: 20, textAlign: "center", color: "White" }}>
                                No products found in this category.
                            </div>
                        )}
                    </div>

                    {/* PAGINATION BUTTONS */}
                    <div className="flex justify-center rounded-b-2xl">
                        <button
                            onClick={() => setPageIndex((p) => p - 1)}
                            disabled={!canPrev}
                            style={{
                                padding: "8px 15px",
                                borderRadius: "50%",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <span style={{ color: "white", fontWeight: "bold", position: "relative", top: 6 }}>
                            {paginatedItems.length > 0 ? `Page ${pageIndex + 1}` : "No products"}
                        </span>

                        <button
                            onClick={() => setPageIndex((p) => p + 1)}
                            disabled={!canNext}
                            style={{
                                padding: "8px 15px",
                                borderRadius: "50%",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
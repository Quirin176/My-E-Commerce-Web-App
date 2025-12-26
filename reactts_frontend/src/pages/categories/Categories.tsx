import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
// import DynamicFilters from "../../../components/DynamicFilters";
import ProductCard from "../../components/Product/ProductCard";
import { productApi } from "../../api/productApi";
import { filterApi } from "../../api/filterApi";

export default function CategoryProducts() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("100000000");
  const [priceOrder, setPriceOrder] = useState("newest");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic filter states
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  if (!slug) {
    return <div className="p-4 text-red-500">Invalid category.</div>;
  }

  const formattedName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Load products with all filters applied
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getByFilters(slug, {
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        priceOrder,
        options: selectedOptions.length > 0 ? selectedOptions.join(",") : null,
      });

      const productList = Array.isArray(data) ? data : data?.data || [];
      setProducts(productList);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
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
    async function loadFilters() {
      try {
        const filters = await filterApi.getFiltersByCategory(slug);
        const filterList = Array.isArray(filters) ? filters : [];
        setDynamicFilters(filterList);
      } catch (error) {
        console.error("Error loading filters:", error);
        setDynamicFilters([]);
      }
    }
    loadFilters();
  }, [slug]);

  // Check for filter in URL query params (from dropdown click)
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    
    if (filterParam) {
      const optionValueId = parseInt(filterParam);
      
      // Check if this option value exists in the filters
      const exists = dynamicFilters.some(option =>
        option.optionValues.some(val => val.optionValueId === optionValueId)
      );

      if (exists && !selectedOptions.includes(optionValueId)) {
        setSelectedOptions([optionValueId]);
      }
    }
  }, [searchParams, dynamicFilters]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{formattedName}</h1>

      {/* Dynamic filters with Brand, Price, and Sort all in one */}
      {/* <DynamicFilters
        categories={dynamicFilters}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        priceOrder={priceOrder}
        setPriceOrder={setPriceOrder}
      /> */}

      {/* Products grid */}
      {loading ? (
        <p className="text-gray-500 text-lg text-center py-8">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-lg text-center py-8">
          No products found in {formattedName} with selected filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

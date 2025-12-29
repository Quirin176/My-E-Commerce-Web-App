import { useEffect, useState, useMemo } from "react";
import { adminProductsApi } from "../api/admin/adminProductsApi";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filter, setFilter] = useState({
    category: null,
    brand: null,
    search: "",
    minPrice: "",
    maxPrice: "",
  });

  // Sorting
  const [sort, setSort] = useState({ key: "id", direction: "desc" });

  // Load products
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await adminProductsApi.getProducts();
        setProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Unique brands
  const brands = useMemo(() => {
    const filtered = filter.category
      ? products.filter((p) => p.categoryId === filter.category)
      : products;

    const brandSet = new Set();
    filtered.forEach((p) => {
      const brand = p.options?.find(
        (o) => o.optionName?.toLowerCase() === "brand"
      )?.value;

      if (brand) brandSet.add(brand);
    });

    return [...brandSet].sort();
  }, [products, filter.category]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (filter.category) {
      data = data.filter((p) => p.categoryId === filter.category);
    }
    if (filter.brand) {
      data = data.filter((p) =>
        p.options?.some(
          (o) =>
            o.optionName.toLowerCase() === "brand" &&
            o.value === filter.brand
        )
      );
    }
    if (filter.search) {
      const term = filter.search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term) ||
          p.id.toString().includes(term)
      );
    }
    if (filter.minPrice) {
      data = data.filter((p) => p.price >= +filter.minPrice);
    }
    if (filter.maxPrice) {
      data = data.filter((p) => p.price <= +filter.maxPrice);
    }

    return data;
  }, [products, filter]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    list.sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];

      if (typeof aVal === "number") {
        return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sort.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return list;
  }, [filteredProducts, sort]);

  // Delete product
  const deleteProduct = async (id: number) => {
    await adminProductsApi.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    loading,
    products,
    sortedProducts,
    brands,
    filter,
    setFilter,
    sort,
    setSort,
    deleteProduct,
  };
}

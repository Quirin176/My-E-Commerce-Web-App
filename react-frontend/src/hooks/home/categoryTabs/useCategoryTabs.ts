import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Product } from "../../../types/models/products/Product";

interface UseCategoryTabProps {
  activeTab?: number;
  productsPerPage: number;
  numberOfTabs: number;
  fetchProducts: (categoryId: number, limit: number) => Promise<Product[]>;
}

export function useCategoryTab({
  activeTab,
  productsPerPage,
  numberOfTabs,
  fetchProducts,
}: UseCategoryTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    if (!activeTab) return;

    const loadProducts = async () => {
      setProductsLoading(true);

      try {
        const data = await fetchProducts(activeTab, productsPerPage * numberOfTabs);

        if (!Array.isArray(data)) {
          toast.error("Invalid product list");
          setProducts([]);
          return;
        }

        const sorted = [...data].sort((a, b) => Number(b.id) - Number(a.id));

        setProducts(sorted);
      } catch {
        toast.error("Failed to load products");
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [activeTab, fetchProducts, productsPerPage, numberOfTabs,]);

  return {
    products,
    productsLoading,
  };
}
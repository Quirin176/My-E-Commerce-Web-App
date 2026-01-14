import { useCallback, useState } from "react";
import type { Product } from "../types/models/Product";

interface UseProductSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredProducts: Product[];
  clearSearch: () => void;
}

export const useProductSearch = (products: Product[]): UseProductSearchReturn => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  return { searchTerm, setSearchTerm, filteredProducts, clearSearch };
};

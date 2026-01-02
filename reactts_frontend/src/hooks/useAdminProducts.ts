import { useCallback, useEffect, useState } from "react"
import type { Product } from "../types/models/Product";
import { adminProductsApi } from "../api/admin/adminProductsApi";
import toast from "react-hot-toast";

interface UseAdminProductsReturn {
    products: Product[];
    loading: boolean;
    error: string | null;

    //CRUD Operations
    fetchProducts: () => Promise<void>;
    createProduct: (data: any) => Promise<void>;
    updateProduct: (id:number, data: any) => Promise<void>;
    deleteProduct: (id:number) => Promise<void>;
}

export const useAdminProducts = (): UseAdminProductsReturn => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([])
    const [filteredProducts, setFilterProducts] = useState<Product[]>([])

    // Fetch/Show all products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.debug(`[useAdminProducts] Fetching Products`);
            const data = await adminProductsApi.getProducts();
            setProducts(Array.isArray(data) ? data : []); //Set Products[] if data available
            setFilterProducts(Array.isArray(data) ? data : []);
            console.debug(`[useAdminProducts Products Loaded:]`, data)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to Fetch Products";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(`[useAdminProducts] Error Fetching Products:`, error)
        } finally {
            setLoading(false);
        }
    }, [])

    // Create new Product
    const createProduct = useCallback(async (data: any) => {
        setLoading(true);

        try {
            console.debug(data);
            const newProduct = await adminProductsApi.createProduct(data);
            setProducts(prev => [newProduct, ...prev]);
            setFilterProducts(prev => [newProduct, ...prev]);
            toast.success(`Product created successfully!`);
            console.debug(newProduct);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error? error.message : "Failed to Create Product";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(errorMessage);
        } finally {
            setLoading(false);
        }
    })

    // Update Product
    const updateProduct = useCallback(async (id: number, data: any) => {
        setLoading(true);

        try {
            console.debug(data);
            const updatedProduct = await adminProductsApi.updateProduct(id, data);
            setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
            setFilterProducts(prev => prev.map(p =>p.id === id ? updatedProduct : p));
            toast.success(`Product was updated successfully!`);
            console.debug('[useAdminProducts] Product updated:', updatedProduct);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error? error.message : "Failed to Update Product";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(errorMessage);
        } finally {
            setLoading(false);
        }
    })

    // Load products on mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products: filteredProducts,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    };
};
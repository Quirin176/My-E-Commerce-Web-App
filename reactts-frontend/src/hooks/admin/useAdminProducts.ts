// // THIS IS A CUSTOM HOOK FOR MANAGING ADMIN PRODUCTS INCLUDING FETCHING, CREATING, UPDATING, AND DELETING PRODUCTS

// import { useCallback, useEffect, useState } from "react"
// import toast from "react-hot-toast";
// import { adminProductsApi } from "../../api/admin/adminProductsApi";
// import type { Product } from "../../types/models/Product";

// interface UseAdminProductsReturn {
//     products: Product[];
//     loading: boolean;
//     error: string | null;

//     // CRUD Operations
//     fetchProducts: () => Promise<void>;
//     createProduct: (data: Product) => Promise<void>;
//     updateProduct: (id: number, data: Product) => Promise<void>;
//     deleteProduct: (id: number) => Promise<void>;
// }

// export const useAdminProducts = (): UseAdminProductsReturn => {
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch/Show all products
//     const fetchProducts = useCallback(async () => {
//         setLoading(true);
//         setError(null);

//         try {
//             console.debug(`[useAdminProducts] Fetching Products`);
//             const data = await adminProductsApi.getProductsAll();
//             setProducts(Array.isArray(data) ? data : []); //Set Products[] if data available
//             console.debug(`[useAdminProducts] Products Loaded:`, data)
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : "Failed to Fetch Products";
//             setError(errorMessage);
//             toast.error(errorMessage);
//             console.error(`[useAdminProducts] Error Fetching Products:`, error)
//         } finally {
//             setLoading(false);
//         }
//     }, [])

//     // Create new Product
//     const createProduct = useCallback(async (data: Product) => {
//         setLoading(true);
//         setError(null);

//         try {
//             console.debug(`[useAdminProducts] Creating Product:`, data);
//             const newProduct = await adminProductsApi.createProduct(data);
//             setProducts(prev => [newProduct, ...prev]);
//             toast.success(`Product created successfully!`);
//             console.debug(`[useAdminProducts] Product Created:`, newProduct);
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : "Failed to Create Product";
//             setError(errorMessage);
//             toast.error(errorMessage);
//             console.error(`[useAdminProducts] Error Creating Product:`, error);
//             throw error;
//         } finally {
//             setLoading(false);
//         }
//     }, [])

//     // Update Product by ID
//     const updateProduct = useCallback(async (id: number, data: Product) => {
//         setLoading(true);
//         setError(null);

//         try {
//             console.debug(`[useAdminProducts] Updating Product ${id}:`, data);
//             const updatedProduct = await adminProductsApi.updateProductById(id, data);
//             setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
//             toast.success(`Product updated successfully!`);
//             console.debug(`[useAdminProducts] Product Updated:`, updatedProduct);
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : "Failed to Update Product";
//             setError(errorMessage);
//             toast.error(errorMessage);
//             console.error(`[useAdminProducts] Error Updating Product:`, error);
//             throw error;
//         } finally {
//             setLoading(false);
//         }
//     }, [])

//     // Update Product by Slug
//     // const updateProduct = useCallback(async (slug: string, data: Product) => {
//     //     setLoading(true);
//     //     setError(null);

//     //     try {
//     //         console.debug(`[useAdminProducts] Updating Product ${slug}:`, data);
//     //         const updatedProduct = await adminProductsApi.updateProductBySlug(slug, data);
//     //         setProducts(prev => prev.map(p => p.slug === slug ? updatedProduct : p));
//     //         toast.success(`Product updated successfully!`);
//     //         console.debug(`[useAdminProducts] Product Updated:`, updatedProduct);
//     //     } catch (error: unknown) {
//     //         const errorMessage = error instanceof Error ? error.message : "Failed to Update Product";
//     //         setError(errorMessage);
//     //         toast.error(errorMessage);
//     //         console.error(`[useAdminProducts] Error Updating Product:`, error);
//     //         throw error;
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // }, [])

//     // Delete Product
//     const deleteProduct = useCallback(async (id: number) => {
//         setLoading(true);
//         setError(null);

//         try {
//             console.debug(`[useAdminProducts] Deleting Product ${id}`);
//             await adminProductsApi.deleteProduct(id);
//             setProducts(prev => prev.filter(p => p.id !== id));
//             toast.success(`Product deleted successfully!`);
//             console.debug(`[useAdminProducts] Product Deleted with ID: ${id}`);
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : "Failed to Delete Product";
//             setError(errorMessage);
//             toast.error(errorMessage);
//             console.error(`[useAdminProducts] Error Deleting Product:`, error);
//             throw error;
//         } finally {
//             setLoading(false);
//         }
//     }, [])

//     // Load products on mount
//     useEffect(() => {
//         fetchProducts();
//     }, [fetchProducts]);

//     return {
//         products,
//         loading,
//         error,
//         fetchProducts,
//         createProduct,
//         updateProduct,
//         deleteProduct,
//     };
// };

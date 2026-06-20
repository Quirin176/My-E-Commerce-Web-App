import { useEffect, useState } from "react";

import { productApi } from "../../api/products/productApi";
import { productimageApi } from "../../api/products/productimageApi";

import type { Product, ProductVariant, ImagePayload } from "../../types/models/products/Product";

interface useProductDetailsReturn {
    product: Product | null;
    variants: ProductVariant[];
    productImages: ImagePayload[];
    loading: boolean;
    error: boolean;
}

export function useProductDetails(slug?: string): useProductDetailsReturn {
    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [productImages, setProductImages] = useState<ImagePayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const product = await productApi.getProductBySlug(slug);
                setProduct(product);
                const images = await productimageApi.GetByProduct(product.id);
                if (images && images.length > 0) {
                    setProductImages(images);
                }

                setVariants(product.variants);
            }
            catch {
                setError(true);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [slug]);

    return {
        product,
        variants,
        productImages,
        loading,
        error
    };
}
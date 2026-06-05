import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/auth/useAuth";
import { useCart } from "../../hooks/cart/useCart";

import type { Product, ProductVariant } from "../../types/models/products/Product";

import AddToCartSection from "./AddToCartSection";

interface ProductInfoProps {
    product: Product;
    onVariantChange?: (variant: ProductVariant) => void;
};

interface CartItem {
    id: number | string;
    name: string;
    slug: string;
    price: number;
    image: string;
};

export default function ProductInfo({ product, onVariantChange }: ProductInfoProps) {

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        onVariantChange?.(variant);
    };

    const hasVariants = (product.variants?.length ?? 0) > 0;
    const displayPrice = (hasVariants && selectedVariant) ? selectedVariant.price : product.basePrice;
    const displayStock = (hasVariants && selectedVariant) ? selectedVariant.stock : product.stock;

    const { user } = useAuth();
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!user || user.role === "Admin") {
            toast.error("You must be logged in as a customer to add items to the cart.");
            return;
        }

        let item: CartItem;

        if (hasVariants && selectedVariant) {
            item = {
                id: product.id,
                name: `${product.name} / ${selectedVariant.variantName}`,
                slug: product.slug,
                price: selectedVariant.price,
                image: selectedVariant.images[0].imageUrl,
            };
        }
        else {
            item = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.basePrice,
                image: product.thumbnailUrl,
            };
        }

        try {
            addToCart(item, 1);
            toast.success(`${item.name} added to cart!`);
        } catch (error) {
            toast.error(`Failed to add ${item.name} to cart.`);
        }
    };

    return (
        <div>

            <h1 className="text-4xl font-bold">
                {product.name}
            </h1>

            <p className="text-gray-600 my-2">
                <strong>Category:</strong>{" "}
                <Link to={`/category/${product.category?.slug || ""}`} className="text-blue-600 font-bold hover:underline">
                    {product.category?.name}
                </Link>
            </p>

            {product.variants?.length > 0 && (
                <div className="mt-6">
                    <div className="space-y-3">

                        <h3 className="font-semibold">
                            Choose Variant
                        </h3>

                        <div className="flex flex-wrap gap-2">

                            {product.variants.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => handleVariantSelect(v)}
                                    className={`px-4 py-2 rounded border ${selectedVariant?.id === v.id ?
                                        "border-blue-600 bg-blue-50" : "border-gray-300"}`}
                                >
                                    {v.variantName}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <AddToCartSection
                price={displayPrice}
                stock={displayStock}
                onAddToCart={() => handleAddToCart()}
            />
        </div>
    );
}
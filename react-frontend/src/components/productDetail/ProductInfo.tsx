import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/auth/useAuth";
import { useCart } from "../../hooks/cart/useCart";

import type { Product, ProductVariant } from "../../types/models/products/Product";

interface ProductInfoProps {
    product: Product;
    onVariantChange?: (variant: ProductVariant) => void;
}

export default function ProductInfo({ product, onVariantChange }: ProductInfoProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(product.variants?.[0]);

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        onVariantChange?.(variant);
    };

    const hasVariants = (product.variants?.length ?? 0) > 0;
    const displayPrice = hasVariants && selectedVariant ? selectedVariant.price : product.basePrice;
    const displayStock = hasVariants && selectedVariant ? selectedVariant.stock : product.stock;

    const { user } = useAuth();
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!user || user.role === "Admin") {
            toast.error("You must be logged in as a customer to add items to the cart.");
            return;
        }

        if (hasVariants && !selectedVariant) {
            toast.error("Please select a variant.");
            return;
        }

        if (hasVariants && selectedVariant) {
            // Each variant gets a unique cartId so they are tracked independently
            addToCart(
                {
                    cartId: `${product.id}-variant-${selectedVariant.id}`,
                    id: product.id,
                    variantId: selectedVariant.id,
                    name: `${product.name} / ${selectedVariant.variantName}`,
                    slug: product.slug,
                    price: selectedVariant.price,
                    image: selectedVariant.images?.[0]?.imageUrl ?? product.thumbnailUrl ?? "",
                    option: selectedVariant.optionValues?.map((pvov) => ({
                        optionName: pvov.optionName ?? "",
                        value: pvov.value ?? "",
                    })),
                },
                1
            );
        } else {
            addToCart(
                {
                    cartId: `${product.id}-base`,
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.basePrice,
                    image: product.thumbnailUrl ?? "",
                },
                1
            );
        }

        toast.success(hasVariants && selectedVariant ?
            `${product.name} / ${selectedVariant.variantName} added to cart!` :
            `${product.name} added to cart!`
        );
    };

    return (
        <div>
            <h1 className="text-4xl font-bold">{product.name}</h1>

            <p className="text-gray-600 my-2">
                <strong>Category:</strong>{" "}
                <Link
                    to={`/category/${product.category?.slug ?? ""}`}
                    className="text-blue-600 font-bold hover:underline"
                >
                    {product.category?.name}
                </Link>
            </p>

            {hasVariants && (
                <div className="mt-6 space-y-3">
                    <h3 className="font-semibold">Choose Variant</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.variants.map((v) => (
                            <button
                                key={v.id}
                                onClick={() => handleVariantSelect(v)}
                                className={`px-4 py-2 rounded border transition ${selectedVariant?.id === v.id
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                {v.variantName}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <div className="text-3xl font-bold text-blue-600">
                    {displayPrice.toLocaleString()} VND
                </div>
                <div className="text-sm text-gray-500 mt-1">
                    {displayStock} items available
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={displayStock <= 0}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition"
            >
                {displayStock > 0 ? "Add To Cart" : "Out Of Stock"}
            </button>
        </div>
    );
}
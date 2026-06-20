import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/auth/useAuth";
import { useCart } from "../../hooks/cart/useCart";

import type { Product, ProductVariant } from "../../types/models/products/Product";

interface ProductInfoProps {
    product: Product;
    brandId: number | undefined;
    brandName: string | undefined;
    selectedVariant?: ProductVariant;
    onVariantChange?: (variant?: ProductVariant) => void;
}

export default function ProductInfo({ product, brandId, brandName, selectedVariant, onVariantChange }: ProductInfoProps) {

    const handleVariantSelect = (variant: ProductVariant) => {
        if (selectedVariant?.id === variant.id) {
            onVariantChange?.(undefined);
        } else {
            onVariantChange?.(variant);
        }
    };

    const displayPrice = selectedVariant ? selectedVariant.price : product.basePrice;
    const displayBasePrice = selectedVariant ? selectedVariant.originalPrice : product.basePrice;
    const discountPercentage = 100 - displayPrice / displayBasePrice * 100;

    const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

    const { user } = useAuth();
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!user || user.role === "Admin") {
            toast.error("You must be logged in as a customer to add items to the cart.");
            return;
        }

        if (!selectedVariant) {
            toast.error("Please select a variant.");
            return;
        }

        if (selectedVariant) {
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

        toast.success(selectedVariant ?
            `${product.name} / ${selectedVariant.variantName} added to cart!` :
            `${product.name} added to cart!`
        );
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">

                <h1 className="text-2xl font-bold">{product.name}</h1>

                <div className="flex gap-x-8">
                    <p className="text-lg">
                        <strong className="pr-4">Category:</strong>
                        <Link
                            to={`/category/${product.category?.slug ?? ""}`}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            {product.category?.name}
                        </Link>
                    </p>

                    <p className="text-lg">
                        <strong className="pr-4">Brand:</strong>
                        <Link
                            to={`/category/${product.category?.slug ?? ""}?selectedOptions=${brandId}`}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            {brandName}
                        </Link>
                    </p>
                </div>

            </div>

            <div className="space-y-4">
                <h3 className="font-semibold">Choose Variant</h3>
                <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                        <button
                            key={v.id}
                            onClick={() => handleVariantSelect(v)}
                            className={`px-4 py-2 rounded border transition cursor-pointer ${selectedVariant?.id === v.id ?
                                "border-blue-600 text-blue-600 font-semibold" : "border-(--border) hover:border-blue-600"}`}
                        >
                            {v.variantName}
                        </button>
                    ))}
                </div>
            </div>

            {selectedVariant ? (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <div className="text-3xl font-bold text-blue-600">
                            {displayPrice.toLocaleString()} VND
                        </div>
                        {displayBasePrice > displayPrice && (
                            <div>
                                <p className="text-sm font-bold text-gray-600 line-through">
                                    {displayBasePrice.toLocaleString()} VND
                                </p>
                                <p className="text-sm font-bold text-red-600">
                                    - {discountPercentage.toLocaleString()} %
                                </p>
                            </div>
                        )}
                    </div>

                    <p>
                        {displayStock} items available
                    </p>

                    <button
                        onClick={handleAddToCart}
                        disabled={displayStock <= 0}
                        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition"
                    >
                        {displayStock > 0 ? "Add To Cart" : "Out Of Stock"}
                    </button>

                </div>

            ) : (
                <p className="mt-6 w-full bg-blue-600 text-white text-center py-3 rounded-lg">
                    Select A Variant
                </p>
            )}
        </div>
    );
}
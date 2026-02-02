import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../../hooks/useCart"
import type { CartItem } from "../../types/models/cart/CartItem"
import { siteConfig } from "../../config/siteConfig";

export default function CartItemCard(CartItem: CartItem) {
    const colors = siteConfig.colors;

    const { updateQuantity, removeFromCart } = useCart();

    const handleQuantityChange = (productId: number | string, newQuantity: number) => {
        if (newQuantity <= 0) {
            return;
        }
        updateQuantity(productId, newQuantity)
    };

    const handleRemove = (productId: number | string, productName: string) => {
        removeFromCart(productId);
        toast.success(`${productName} removed from cart`);
    };

    return (
        <div className="p-6 hover:bg-gray-50 transition flex gap-6">
            {/* Product Image */}
            <img
                src={CartItem.image || "https://via.placeholder.com/150?text=No+Image"}
                alt={CartItem.name}
                className="w-32 h-32 object-cover rounded-lg hover:opacity-80 transition"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/150?text=No+Image";
                }}
            />

            {/* Product Details */}
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <Link
                        to={`/product/${CartItem.slug}`}
                        className="text-xl font-bold hover:underline"
                        style={{ color: colors.primarycolor }}
                    >
                        {CartItem.name}
                    </Link>

                    {/* Remove Button */}
                    <button
                        onClick={() => handleRemove(CartItem.id, CartItem.name)}
                        className="ml-auto p-2 text-red-600 hover:bg-red-200 rounded-lg transition"
                        title="Remove from cart"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {/* Options */}
                {CartItem.option && CartItem.option.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {CartItem.option.map((opt, index) => (
                            <p key={index} className="text-sm text-gray-600">
                                <strong>{opt.optionName}:</strong> {opt.value}
                            </p>
                        ))}
                    </div>
                )}

                {/* Price */}
                <p className="text-lg font-bold mt-3" style={{ color: colors.pricecolor }}>
                    {CartItem.price.toLocaleString()} VND
                </p>

                <div className="flex items-center justify-between gap-4 mt-4">
                    {/* Quantity Control */}
                    <div className="flex items-center border rounded-lg">
                        <button
                            onClick={() =>
                                handleQuantityChange(CartItem.id, CartItem.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                            disabled={CartItem.quantity <= 1}
                        >
                            <Minus size={18} />
                        </button>
                        <span className="px-4 py-2 font-semibold">
                            {CartItem.quantity}
                        </span>
                        <button
                            onClick={() =>
                                handleQuantityChange(CartItem.id, CartItem.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    {/* Subtotal */}
                    <p className="text-lg text-right text-gray-600 mt-3">
                        Subtotal:{" "}
                        <span className="font-bold" style={{ color: colors.primarycolor }}>
                            {(CartItem.price * CartItem.quantity).toLocaleString()} VND
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}
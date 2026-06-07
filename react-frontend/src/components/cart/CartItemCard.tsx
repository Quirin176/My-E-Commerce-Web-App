import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../hooks/cart/useCart";
import type { CartItem } from "../../types/models/cart/CartItem";

export default function CartItemCard(item: CartItem) {
    const { updateQuantity, removeFromCart } = useCart();

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity <= 0) return;
        updateQuantity(item.cartId, newQuantity);
    };

    const handleRemove = () => {
        removeFromCart(item.cartId);
        toast.success(`${item.name} removed from cart`);
    };

    return (
        <div className="p-6 hover:bg-gray-50 transition flex gap-6">
            <img
                src={item.image || "https://via.placeholder.com/150?text=No+Image"}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-lg hover:opacity-80 transition"
                onError={(e) => {
                    (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
            />

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <Link
                        to={`/product/${item.slug}`}
                        className="text-(--brand-primary) text-xl font-bold hover:underline"
                    >
                        {item.name}
                    </Link>

                    <button
                        onClick={handleRemove}
                        className="ml-auto p-2 text-red-600 hover:bg-red-200 rounded-lg transition"
                        title="Remove from cart"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {item.option && item.option.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {item.option.map((opt, index) => (
                            <p key={index} className="text-sm text-gray-600">
                                <strong>{opt.optionName}:</strong> {opt.value}
                            </p>
                        ))}
                    </div>
                )}

                <p className="text-(--price) text-lg font-bold mt-3">
                    {item.price.toLocaleString()} VND
                </p>

                <div className="flex items-center justify-between gap-4 mt-4">
                    <div className="flex items-center border rounded-lg">
                        <button
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition"
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={18} />
                        </button>
                        <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <p className="text-lg text-right text-gray-600 mt-3">
                        Subtotal:{" "}
                        <span className="text-(--brand-primary) font-bold">
                            {(item.price * item.quantity).toLocaleString()} VND
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
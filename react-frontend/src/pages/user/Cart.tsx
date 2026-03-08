import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import CartItemCard from "../../components/User/CartItemCard";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { siteConfig } from "../../config/siteConfig"

export default function Cart() {
  const colors = siteConfig.colors;
  const navigate = useNavigate();
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingout] = useState(false)

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!user) {
      toast.error("Please log in to proceed to checkout");
      navigate("/auth?mode=login");
      return;
    }

    setIsCheckingout(true);
    try {
      toast.success("Proceeding to checkout...");
      setTimeout(() => {
        navigate("/checkout");
      }, 1000);
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
      console.error("Checkout error: ", error);
    } finally {
      setIsCheckingout(false);
    }
  };

  const totalPrice = getTotalPrice();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Please log in to view your cart</p>
        <Link
          to="/auth?mode=login"
          className="inline-block px-6 py-3 text-white rounded-lg hover:brightness-75 transition"
          style={{ background: colors.primarycolor }}
        >
          Go to Login
        </Link>
      </div>
    )
  }
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
        <p className="text-xl text-gray-600 mb-8">Add some products to get started!</p>
        <Link
          to="/home"
          className="inline-block px-6 py-3 text-white rounded-lg hover:brightness-75 transition"
          style={{ background: colors.primarycolor }}
        >
          Back to Home Page
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl rounded-2xl bg-gray-100">

      {/* Cart Actions */}
      <div className="flex items-center justify-between pb-6">
        {/* Header */}
        <h1 className="text-3xl font-bold" style={{ color: colors.primarycolor }}>
          Shopping Cart
        </h1>

        <button
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to clear your cart?"
              )
            ) {
              clearCart();
              toast.success("Cart cleared");
            }
          }}
          className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold"
        >
          Clear All Cart Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Cart Items List */}
            <div className="divide-y">
              {cartItems.map((cartItem) => (
                <CartItemCard {...cartItem} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.primarycolor }}>
              Order Summary
            </h2>

            {/* Summary Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items):</span>
                <span className="font-semibold">
                  {totalPrice.toLocaleString()} VND
                </span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Tax:</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span style={{ color: colors.pricecolor }}>
                  {totalPrice.toLocaleString()} VND
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || cartItems.length === 0}
              className="w-full py-3 text-white font-bold rounded-lg hover:brightness-75 transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: colors.primarycolor }}
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>

            {/* Continue Shopping Link */}
            <Link
              to="/home"
              className="block text-center mt-4 py-2 border-2 rounded-lg font-semibold transition hover:bg-gray-50"
              style={{ borderColor: colors.primarycolor, color: colors.primarycolor }}
            >
              Continue Shopping
            </Link>

            {/* Promo Code (Optional)
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-3">Have a promo code?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled
                />
                <button
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition font-semibold text-gray-600"
                  disabled
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Promo code feature coming soon
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

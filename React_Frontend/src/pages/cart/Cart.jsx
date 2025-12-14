// Update: src/pages/cart/Cart.jsx

import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Trash2, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const total = cart.reduce((s, p) => s + p.price * p.qty, 0);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/auth/login");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center p-4 border rounded-lg hover:shadow-md transition bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/96?text=No+Image";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-3">
                        {item.price.toLocaleString()} VND
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="px-3 py-1 border rounded hover:bg-gray-100 transition font-semibold"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) =>
                            updateQty(item.id, Number(e.target.value) || 1)
                          }
                          className="w-16 text-center border rounded px-2 py-1"
                        />
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-3 py-1 border rounded hover:bg-gray-100 transition font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600 mb-3">
                        {(item.price * item.qty).toLocaleString()} VND
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success(`${item.name} removed from cart`);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg shadow sticky top-4">
                <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

                {/* Items List */}
                <div className="space-y-2 mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} <span className="font-semibold">x{item.qty}</span>
                      </span>
                      <span className="font-semibold">
                        {(item.price * item.qty).toLocaleString()} VND
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">
                      {total.toLocaleString()} VND
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Shipping:</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {total.toLocaleString()} VND
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="w-full border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => {
                      clearCart();
                      toast.success("Cart cleared");
                    }}
                    className="w-full text-red-600 py-2 rounded hover:bg-red-50 transition font-semibold text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

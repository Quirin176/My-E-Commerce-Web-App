import React from "react";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();

  const total = cart.reduce((s, p) => s + p.price * p.qty, 0);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cart.length === 0 ? (<p>Your cart is empty.</p>) : (
        <>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center p-3 border rounded">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>

                  <p className="text-gray-600">{item.price.toLocaleString()} VND</p>

                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 py-1 border rounded">-</button>
                    <input
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateQty(item.id, Number(e.target.value) || 1)}
                      className="w-16 text-center border rounded"
                    />
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 py-1 border rounded">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-600">Remove</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{(item.price * item.qty).toLocaleString()} VND</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <button onClick={clearCart} className="px-4 py-2 border rounded">Clear Cart</button>
            </div>
            <div>
              <div className="text-xl font-bold">Total: {total.toLocaleString()}</div>
              <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

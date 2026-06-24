import { useCart } from "../../hooks/cart/useCart"

export default function CheckoutOrderSummary() {
    const { cartItems, getTotalPrice } = useCart();
    const totalPrice = getTotalPrice();
    
    return (
        <div className="lg:col-span-1" >
            <div className="px-8 py-4 border-2 rounded-xl shadow-lg bg-(--bg-surface)">
                <h2 className="text-2xl font-bold text-center mb-4">Order Summary</h2>

                <div className="grid grid-cols-5 border-t-2 mb-4">
                    <span className="col-span-3 text-lg text-center font-semibold">Order Items</span>
                    <span className="col-start-5 text-lg text-center font-semibold">Price</span>
                </div>

                <div className="space-y-3 mb-4 pb-4 max-h-64 overflow-y-auto">
                    {cartItems.map(item => (
                        <div key={item.id} className="grid grid-cols-5 border-b-2">
                            <span className="col-span-3 text-lg font-semibold">{item.name}</span>
                            <span className="col-span-3 text-lg text-right font-semibold">{(item.price).toLocaleString()} VND</span>
                            <span className="col-span-1 text-lg text-center font-semibold text-(--price)">x{item.quantity}</span>
                            <span className="col-span-1 text-lg text-right font-semibold">{(item.price * item.quantity).toLocaleString()} VND</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="font-bold text-lg">Subtotal:</span>
                        <span className="text-lg font-semibold">{totalPrice.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-bold text-lg">Shipping:</span>
                        <span className="text-lg font-semibold">Free</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-bold text-lg">Tax:</span>
                        <span className="text-lg font-semibold">Calculated</span>
                    </div>
                    <div className="border-t-2 pt-2 mt-2 flex justify-between">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="text-(--price) font-bold text-lg">{totalPrice.toLocaleString()} VND</span>
                    </div>
                </div>
            </div>
        </div >
    )
}
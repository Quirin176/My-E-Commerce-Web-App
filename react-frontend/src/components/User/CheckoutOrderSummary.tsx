import { useCart } from "../../hooks/useCart"
import { siteConfig } from "../../config/siteConfig";

export default function CheckoutOrderSummary() {
    const { cartItems, getTotalPrice } = useCart();
    const totalPrice = getTotalPrice();
    const colors = siteConfig.colors;
    return (
        <div className = "lg:col-span-1" >
            <div className="bg-gray-100 px-8 py-4 border-2 rounded-xl shadow-lg">
                <h3 className="text-3xl font-bold text-center mb-4">Order Summary</h3>

                        <div className="grid grid-cols-5 border-t-2 mb-4">
                            <span className="col-span-3 text-lg text-center font-semibold">Order Items</span>
                            <span className="col-start-5 text-lg text-center font-semibold">Price</span>
                        </div>

                <div className="space-y-3 mb-4 pb-4 max-h-64 overflow-y-auto">
                    {cartItems.map(item => (
                        <div key={item.id} className="grid grid-cols-5 border-b-2">
                            <span className="col-span-3 text-lg font-semibold">{item.name}</span>
                            <span className="col-span-3 text-lg text-right font-semibold">{(item.price).toLocaleString()} VND</span>
                            <span className="col-span-1 text-lg text-center font-semibold" style={{color: colors.pricecolor}}>x{item.quantity}</span>
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
                    <div className="border-t-2 pt-2 mt-2 flex justify-between">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="font-bold text-lg" style={{color: colors.pricecolor}}>{totalPrice.toLocaleString()} VND</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

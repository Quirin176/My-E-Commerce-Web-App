import type { OrderResponseModel } from "../types/models/order/OrderResponseModel";

interface Props {
    order: OrderResponseModel;
}

export default function PrintOrderInvoice({ order }: Props) {
    return (
        <div className="w-full max-w-3xl mx-auto p-8 text-black">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">INVOICE</h1>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
            </div>

            {/* Customer + Shipping */}
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Customer Info</h2>
                    <p>{order.customerName}</p>
                    <p>{order.customerEmail}</p>
                    <p>{order.customerPhone}</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
                    <p>{order.shippingAddress}</p>
                </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Item</th>
                            <th className="text-right">Qty</th>
                            <th className="text-right">Unit Price</th>
                            <th className="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr key={item.productId} className="border-b">
                                <td className="py-2">{item.productName}</td>
                                <td className="text-right">{item.quantity}</td>
                                <td className="text-right">
                                    {item.unitPrice.toLocaleString()} VND
                                </td>
                                <td className="text-right font-semibold">
                                    {item.totalPrice.toLocaleString()} VND
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total */}
                <div className="text-right mt-6">
                    <p className="text-gray-700">
                        Subtotal: {order.totalAmount.toLocaleString()} VND
                    </p>
                    <p className="text-gray-700">Shipping: Free</p>
                    <p className="mt-2 text-xl font-bold">
                        Total: {order.totalAmount.toLocaleString()} VND
                    </p>
                </div>
            </div>

            {order.notes && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold">Notes</h2>
                    <p className="text-gray-700">{order.notes}</p>
                </div>
            )}
        </div>
    );
}
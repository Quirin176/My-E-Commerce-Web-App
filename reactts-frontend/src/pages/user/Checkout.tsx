import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { siteConfig } from "../../config/siteConfig";
import CheckoutOrderSummary from "../../components/User/CheckoutOrderSummary";
import { checkoutApi } from "../../api/checkoutApi";

export default function Checkout() {
    const { user } = useAuth();
    const { cartItems, clearCart, getTotalPrice } = useCart();
    const totalPrice = getTotalPrice();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const colors = siteConfig.colors;

    const [checkoutFormInformation, setCheckoutFormInformation] = useState({
        fullName: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: "",
        ward: "",
        city: "",
        postalCode: "",
        note: ""
    });

    const handleInformationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCheckoutFormInformation(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // prevent page reload
        setLoading(false)

        try {
            if (!checkoutFormInformation.fullName || !checkoutFormInformation.email || !checkoutFormInformation.phone || !checkoutFormInformation.address || !checkoutFormInformation.ward || !checkoutFormInformation.city) {
                toast.error("Please fill in all required shipping information");
                return;
            }

            const orderData = {
                customerName: checkoutFormInformation.fullName,
                customerEmail: checkoutFormInformation.email,
                customerPhone: checkoutFormInformation.phone,
                shippingAddress: `${checkoutFormInformation.address}, ${checkoutFormInformation.ward}, ${checkoutFormInformation.city}`,
                city: checkoutFormInformation.city,
                totalAmount: totalPrice,
                paymentMethod: "Cash on Delivery (COD)",
                orderItems: cartItems.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    totalPrice: item.price * item.quantity
                })),
                status: "Pending",
                notes: checkoutFormInformation.note,
            };

            // API create order
            await checkoutApi.createOrder(orderData)

            toast.success("Order placed successfully!");
            navigate("/orders");
            clearCart();

        } catch (error) {
            console.error("Checkout error: ", error);
            toast.error("Checkout error");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Please Login First</h1>
                <p className="text-gray-600 mb-6">You need to be logged in to checkout</p>
                <button
                    onClick={() => navigate("/auth/login")}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Go to Login
                </button>
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
        <div className="flex justify-center gap-4">
            <div className="w-full max-w-2xl bg-gray-100 px-8 py-4 border-2 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">Checkout Form</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        {/* Full name */}
                        <div className="grid grid-cols-5 gap-4 items-center">
                            <label className="text-lg font-semibold col-span-1">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={checkoutFormInformation.fullName}
                                onChange={handleInformationChange}
                                className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                            />
                        </div>

                        {/* Email */}
                        <div className="grid grid-cols-5 gap-4 items-center">
                            <label className="text-lg font-semibold col-span-1">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={checkoutFormInformation.email}
                                onChange={handleInformationChange}
                                className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                            />
                        </div>

                        {/* Phone */}
                        <div className="grid grid-cols-5 gap-4 items-center">
                            <label className="text-lg font-semibold col-span-1">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={checkoutFormInformation.phone}
                                onChange={handleInformationChange}
                                className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                            />
                        </div>

                        {/* Address */}
                        <div className="grid grid-cols-5 gap-4 items-center">
                            <label className="text-lg font-semibold col-span-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={checkoutFormInformation.address}
                                onChange={handleInformationChange}
                                className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                            />
                        </div>

                        {/* Ward */}
                        <div className="grid grid-cols-5 gap-4 items-center">
                            <label className="text-lg font-semibold col-span-1">Ward</label>
                            <input
                                type="text"
                                name="ward"
                                value={checkoutFormInformation.ward}
                                onChange={handleInformationChange}
                                className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                            />
                        </div>

                        {/* City */}
                        <div className="grid grid-cols-5 gap-4 items-center">
                            <label className="text-lg font-semibold col-span-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={checkoutFormInformation.city}
                                onChange={handleInformationChange}
                                className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                            />
                        </div>

                        {/* Note */}
                        <div className="grid grid-cols-5 gap-4 items-center">
                            <label className="text-lg font-semibold col-span-1">Note</label>
                            <input
                                type="text"
                                name="note"
                                value={checkoutFormInformation.note}
                                onChange={handleInformationChange}
                                className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white font-semibold border-2 rounded-xl cursor-pointer px-4 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: colors.primarycolor }}
                        >
                            {loading ? "Processing..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>

            <CheckoutOrderSummary />

        </div>
    )
}
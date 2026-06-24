import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../../hooks/auth/useAuth";
import { useCart } from "../../../hooks/cart/useCart";

import { checkoutApi } from "../../../api/checkoutApi";

import CheckoutForm from "./CheckoutForm";
import CheckoutOrderSummary from "../../../components/cart/CheckoutOrderSummary";

export default function Checkout() {
    const { user } = useAuth();
    const { cartItems, clearCart, getTotalPrice } = useCart();
    const totalPrice = getTotalPrice();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
                    onClick={() => navigate("/auth?mode=login")}
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
                    className="inline-block px-6 py-3 text-white bg-(--brand-primary) rounded-lg hover:brightness-75 transition"
                >
                    Back to Home Page
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center gap-8 p-4">
            <h1 className="text-4xl font-bold text-(--brand-primary)">Checkout</h1>

            <div className="flex gap-4">
                <CheckoutForm
                    formData={checkoutFormInformation}
                    loading={loading}
                    onInputChange={handleInformationChange}
                    onSubmit={handleSubmit}
                />

                <CheckoutOrderSummary />
            </div>

        </div>
    )
}
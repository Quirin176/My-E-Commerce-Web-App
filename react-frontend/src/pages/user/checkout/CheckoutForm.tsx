import React from "react";

interface CheckoutFormData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    ward: string;
    city: string;
    postalCode: string;
    note: string;
}

interface CheckoutFormProps {
    formData: CheckoutFormData;
    loading: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function CheckoutForm({ formData, loading, onInputChange, onSubmit }: CheckoutFormProps) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-2xl px-8 py-4 border-2 rounded-xl shadow-lg bg-(--bg-surface)">
            <h2 className="text-2xl font-bold text-center mb-4">Checkout Form</h2>

            {/* Full name */}
            <div className="flex flex-col sm:grid sm:grid-cols-5 gap-1 sm:gap-4 items-start sm:items-center">
                <label className="text-lg font-semibold col-span-1">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={onInputChange}
                    className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                />
            </div>

            {/* Email */}
            <div className="grid grid-cols-5 gap-4 items-center">
                <label className="text-lg font-semibold col-span-1">Email</label>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                />
            </div>

            {/* Phone */}
            <div className="grid grid-cols-5 gap-4 items-center">
                <label className="text-lg font-semibold col-span-1">Phone Number</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                />
            </div>

            {/* Address */}
            <div className="grid grid-cols-5 gap-4 items-center">
                <label className="text-lg font-semibold col-span-1">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onInputChange}
                    className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                />
            </div>

            {/* Ward */}
            <div className="grid grid-cols-5 gap-4 items-center">
                <label className="text-lg font-semibold col-span-1">Ward</label>
                <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={onInputChange}
                    className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                />
            </div>

            {/* City */}
            <div className="grid grid-cols-5 gap-4 items-center">
                <label className="text-lg font-semibold col-span-1">City</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={onInputChange}
                    className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                />
            </div>

            {/* Note */}
            <div className="grid grid-cols-5 gap-4 items-center">
                <label className="text-lg font-semibold col-span-1">Note</label>
                <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={onInputChange}
                    className="col-span-4 border-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="text-white bg-(--brand-primary) font-semibold border-2 rounded-xl cursor-pointer px-4 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Processing..." : "Submit"}
            </button>
        </form>
    );
}
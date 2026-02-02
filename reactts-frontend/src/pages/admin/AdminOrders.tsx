import React from "react";

export default function AdminOrders() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Orders Management</h1>
            <div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={(e) => { console.log("All Orders clicked") }}
                >
                    All Orders
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">All Orders</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">All Orders</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">All Orders</button>
            </div>

        </div>
    )
}

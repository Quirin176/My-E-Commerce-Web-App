import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { siteConfig } from "../config/siteConfig";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAdd = () => {
    if (!user || user.role === "Admin") {
      toast.error(
        "You must be logged in as a customer to add items to the cart."
      );
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || product.image,
      options: product.options || [],
    };

    try {
      addToCart(item, 1);
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error(`Failed to add ${item.name} to cart.`);
      console.error("Cart addition error:", error);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <div className="flex justify-center pt-2">
          <img
            src={
              product.imageUrl ||
              product.image ||
              "https://via.placeholder.com/200x150?text=No+Image"
            }
            alt={product.name}
            className="w-48 h-32 object-cover rounded-md"
          />
        </div>

        <div className="p-2 flex flex-col">
          <div className="h-12 overflow-hidden">
            <h3
              className="font-bold text-base leading-6 text-center"
              style={{ color: siteConfig.colors.headerBg }}
            >
              {product.name}
            </h3>
          </div>

          <div className="h-40 mt-2 overflow-y-auto bg-gray-100 rounded-xl p-2 text-sm text-left">
            {product.options && product.options.length > 0 ? (
              product.options.map((opt, index) => (
                console.log("Product option:", opt) ||
                <p key={index} className="text-gray-700">
                  <strong>{opt.optionName}:</strong> {opt.value}
                </p>
              ))
            ) : (
              <p>No option data available</p>
            )}
          </div>
        </div>
      </Link>

      <div className="p-2">
        <p
          className="text-end text-lg font-bold mb-3 border-t border-b border-gray-100"
          style={{ color: siteConfig.colors.headerBg }}
        >
          {product.price?.toLocaleString() || "N/A"} VND
        </p>
        <button
          onClick={handleAdd}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-150 transform hover:scale-[1.01]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

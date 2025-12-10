import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (!user || user.role === "Admin") {
      toast.error("You must be logged in as a customer to add items to the cart.");
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || product.image,
    };

    try {
      addToCart(item, 1);
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error(`Failed to add ${item.name} to cart.`);
      console.error("Cart addition error:", error);
    }
  };

  // Fetch product by ID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productApi.getById(id);
        setProduct(data);
        // console.log("Product loaded:", data);
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading product...</p>;
  if (!product) return <p className="text-lg text-center p-6 text-red-500">Product not found.</p>;

  // Get category name from category object or use fallback
  const categoryName = product.category?.name || "Unknown Category";

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        {/* Product Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={product.imageUrl || product.image || "https://via.placeholder.com/400x400?text=No+Image"}
            alt={product.name}
            className="rounded-lg shadow-lg max-h-96 object-contain"
          />
        </div>

        {/* Product Content */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          {/* Category */}
          <p className="text-gray-600 mb-2">
            <strong>Category:</strong>{" "}
            <Link to={`/category/${product.category?.slug || ""}`} className="text-blue-600 hover:underline">
              {categoryName}
            </Link>
          </p>

          {/* Short Description */}
          {product.shortDescription && (
            <div className="mb-6 p-4 bg-gray-50 rounded border-l-4 border-blue-600">
              <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.shortDescription}
              </p>
            </div>
          )}

          {/* Price */}
          <p className="text-2xl font-bold text-blue-600 mb-4">
            {product.price?.toLocaleString() || "N/A"} VND
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold mb-6"
          >
            Add to Cart
          </button>
        </div>
      </div>

      
          {/* Full Description */}
          {product.description && (
            <div className="mt-6 p-4 bg-white border rounded">
              <h3 className="font-semibold text-gray-800 mb-3">Full Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

    </div>
  );
}

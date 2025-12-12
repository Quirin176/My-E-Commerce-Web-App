import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      image: product.images?.[0] || product.imageUrl || "https://via.placeholder.com/400",
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

  // Fetch product by ID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productApi.getById(id);

        setProduct(data);
        console.log("Product loaded:", data);
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

  // Get images array - use Images from API response or fall back to imageUrl
  const images = product.images && product.images.length > 0 
    ? product.images 
    : (product.imageUrl ? [product.imageUrl] : ["https://via.placeholder.com/400x400?text=No+Image"]);

  const currentImage = images[currentImageIndex];

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Get category name from category object or use fallback
  const categoryName = product.category?.name || "Unknown Category";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        
        {/* Product Images Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {/* Main Image */}
            <img
              src={currentImage}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-96 object-contain"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
              }}
            />

            {/* Navigation Buttons - Show only if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded text-sm font-semibold">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip - Show only if multiple images */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded border-2 transition ${
                    currentImageIndex === index
                      ? "border-blue-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80?text=No+Image";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Content */}
        <div className="w-full lg:w-1/2">
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

          {/* Short Description
          {product.shortDescription && (
            <div className="mb-6 p-4 bg-gray-50 rounded border-l-4 border-blue-600">
              <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.shortDescription}
              </p>
            </div>
          )} */}

          {/* Product Options/Attributes */}
          {product.options && product.options.length > 0 && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg border-l-4 border-blue-600">
              <h3 className="font-semibold text-gray-800 mb-3">Specifications</h3>
              <div className="space-y-2">
                {product.options.map((opt, index) => (
                  <div key={index} className="text-gray-700">
                    <span className="font-semibold text-gray-800">{opt.optionName}:</span>
                    <span className="ml-2 text-gray-600">{opt.value}</span>
                  </div>
                ))}
              </div>
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

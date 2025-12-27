import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import { useAuth } from "../../hooks/useAuth";
// import { useCart } from "../../context/CartContext";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Product } from "../../types/models/Product";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const { user } = useAuth();
//   const { addToCart } = useCart();

  const handleAdd = () => {
    if (!product) {
      toast.error("Product not found.");
      return;
    }

    if (!user || user.role === "Admin") {
      toast.error("You must be logged in as a customer to add items to the cart.");
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image?.[0] || product.imageUrl || "https://via.placeholder.com/400",
      options: product.options || [],
    };

    try {
    //   addToCart(item, 1);
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

  // Handle click outside modal to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowImageModal(false);
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showImageModal) {
        setShowImageModal(false);
      }
    };

    if (showImageModal) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [showImageModal]);

  if (loading) return <p className="text-center p-6">Loading product...</p>;
  if (!product) return <p className="text-lg text-center p-6 text-red-500">Product not found.</p>;

  // Get images array - ensure it's always an array
  const images: string[] = Array.isArray(product.imageUrl) 
    ? product.imageUrl 
    : (product.imageUrl ? [product.imageUrl] : ["https://via.placeholder.com/400x400?text=No+Image"]);

  const currentImage = images[currentImageIndex];
  const modalImage = images[modalImageIndex];

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToPrevImageModal = () => {
    setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImageModal = () => {
    setModalImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  const categoryName = product.category?.label || "Unknown Category";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        
        {/* Product Images Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">
            {/* Main Image - Clickable */}
            <div onClick={() => openImageModal(currentImageIndex)} className="relative">
              <img
                src={currentImage}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-96 object-contain transition"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/400x400?text=No+Image";
                }}
              />
            </div>

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
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`shrink-0 w-20 h-20 rounded border-2 transition ${
                    currentImageIndex === index
                      ? "border-blue-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded cursor-pointer hover:opacity-80"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/80?text=No+Image";
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

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          {/* Modal Container */}
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-black rounded-lg overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-transparent hover:bg-black/20 text-white p-2 border-black rounded-full transition z-10"
              aria-label="Close modal"
            >
              <X size={32} className="text-black" />
            </button>

            {/* Main Image in Modal */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <img
                src={modalImage}
                alt={`Product view ${modalImageIndex + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/800?text=No+Image";
                }}
              />
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevImageModal}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-black/20 text-black p-3 rounded-full transition"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={goToNextImageModal}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-black/20 text-black p-3 rounded-full transition"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded text-sm font-semibold">
              {modalImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnail Strip at Bottom */}
            {images.length > 1 && (
              <div className="bg-black/50 p-3 flex gap-2 overflow-x-auto">
                {images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`shrink-0 w-16 h-16 rounded border-2 transition ${
                      modalImageIndex === index
                        ? "border-blue-400"
                        : "border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/64?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

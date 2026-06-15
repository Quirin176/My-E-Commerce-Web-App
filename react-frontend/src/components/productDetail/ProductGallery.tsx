import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ImagePayload } from "../../types/models/products/Product"
import ProductImageModal from "./ProductImageModal";

interface Props {
    images: ImagePayload[];
    thumbnail: string;
}

export default function ProductGallery({ images, thumbnail }: Props) {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (images.length > 0 && currentIndex >= images.length) {
            setCurrentIndex(0);
        }
    }, [images]);

    // Guard: nothing to display
    if (images.length === 0) {
        const fallback = thumbnail || "https://via.placeholder.com/400x400?text=No+Image";
        return (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src={fallback}
                    alt="Product"
                    className="w-full h-96 object-contain"
                />
            </div>
        );
    }

    // Safe index — never go out of bounds even if state is momentarily stale
    const safeIndex = Math.min(currentIndex, images.length - 1);
    const currentImage = images[safeIndex]?.imageUrl ?? thumbnail;

    const goToPrevImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <div>
                <div
                    className="relative bg-gray-100 rounded-lg overflow-hidden"
                >
                    <img
                        src={currentImage}
                        alt={String(safeIndex)}
                        className="w-full h-96 object-contain cursor-pointer"
                        onClick={() => setShowModal(true)}
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-500 hover:bg-gray-600 transition cursor-pointer"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="text-white" />
                            </button>

                            <button
                                onClick={goToNextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-500 hover:bg-gray-600 transition cursor-pointer"
                                aria-label="Next image"
                            >
                                <ChevronRight className="text-white" />
                            </button>
                        </>
                    )}
                </div>

                {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`shrink-0 rounded transition cursor-pointer ${index === safeIndex ? "border-2 border-blue-600" : "hover:border-2 hover:border-blue-500"}`}
                            >
                                <img
                                    src={img.imageUrl}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <ProductImageModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    images={images}
                    currentIndex={currentIndex}
                    onPrev={goToPrevImage}
                    onNext={goToNextImage}
                    onSelect={setCurrentIndex}
                />
            )}
        </>
    );
}
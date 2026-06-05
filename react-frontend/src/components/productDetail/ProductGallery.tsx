import { useState } from "react";
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

    const currentImage = images.length > 0 ? images[currentIndex].imageUrl : thumbnail;
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
                        className="w-full h-96 object-contain cursor-pointer"
                        onClick={() => setShowModal(true)}
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)}
                                className="absolute left-3 top-1/2"
                            >
                                <ChevronLeft />
                            </button>

                            <button
                                onClick={() => setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)}
                                className="absolute right-3 top-1/2"
                            >
                                <ChevronRight />
                            </button>
                        </>
                    )}
                </div>

                <div className="flex gap-2 mt-4">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`rounded ${index === currentIndex ? "border border-black" : "border-none"}`}
                        >
                            <img
                                src={img.imageUrl}
                                className="w-20 h-20 object-cover rounded"
                            />
                        </button>
                    ))}
                </div>
            </div>

            <ProductImageModal
                open={showModal}
                onClose={() => setShowModal(false)}
                images={images}
                currentIndex={currentIndex}
                onPrev={goToPrevImage}
                onNext={goToNextImage}
                onSelect={setCurrentIndex}
            />
        </>
    );
}
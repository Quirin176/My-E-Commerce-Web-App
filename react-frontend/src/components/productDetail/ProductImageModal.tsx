import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ImagePayload } from "../../types/models/products/Product";

interface ProductImageModalProps {
    open: boolean;
    onClose: () => void;
    images: ImagePayload[];
    currentIndex: number

    onPrev: () => void;
    onNext: () => void;
    onSelect: (index: number) => void;
}

export default function ProductImageModal({
    open,
    onClose,
    images,
    currentIndex,
    onPrev,
    onNext,
    onSelect
}: ProductImageModalProps) {

    const [thumbStyle] = useState<'vertical' | 'horizontal'>('horizontal');

    // Handle click outside modal to close
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener("keydown", handleEscKey);
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [open]);

    const modalImage = images[currentIndex].imageUrl;

    return (
        <>
            {/* IMAGE MODAL */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={handleBackdropClick}
                >
                    {/* Modal Container */}
                    <div className={`relative max-w-4xl w-full max-h-[90vh] flex ${thumbStyle === 'vertical' ? 'flex-row' : 'flex-col'}
                                    bg-black rounded-lg overflow-hidden`}>

                        {/* Close Button */}
                        <button
                            onClick={() => onClose()}
                            className="absolute top-4 right-4 bg-transparent hover:bg-black/20 text-white p-2 border-black rounded-full transition z-10"
                            aria-label="Close modal"
                        >
                            <X size={32} className="text-black" />
                        </button>

                        {/* Main Image in Modal */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden">
                            <img
                                src={modalImage}
                                alt={`Product view ${currentIndex + 1}`}
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
                                    onClick={() => onPrev()}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={() => onNext()}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition"
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded text-sm font-semibold">
                            {currentIndex + 1} / {images.length}
                        </div>

                        {/* Vertical Thumbnail Strip on Right */}
                        {images.length > 1 && (
                            <div className={`bg-black/50 p-3 flex ${thumbStyle === 'vertical' ? 'flex-col overflow-y-auto' : 'flex-row overflow-x-auto'} gap-2`}>
                                {images.map((img: ImagePayload, index: number) => (
                                    <button
                                        key={index}
                                        onClick={() => onSelect(index)}
                                        className={`shrink-0 w-16 h-16 rounded border-2 transition ${currentIndex === index
                                            ? "border-blue-400"
                                            : "border-gray-600 hover:border-gray-400"
                                            }`}
                                    >
                                        <img
                                            src={img.imageUrl}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover rounded"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "";
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
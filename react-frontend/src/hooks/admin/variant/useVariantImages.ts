import { useState } from "react";
import toast from "react-hot-toast";
import type { ImagePayload } from "../../../api/admin/adminProductsApi";

export function useVariantImages() {
    const [imageInput, setImageInput] = useState("");
    const [images, setImages] = useState<ImagePayload[]>([]);
    const [variantId, setVariantId] = useState<number>(0);

    const addImage = () => {
        if (!imageInput.trim()) return;
        if (images.some((i) => i.imageUrl === imageInput)) {
            toast.error("Image URL already added");
            return;
        }

        setImages((prev) => [
            ...prev,
            {
                imageUrl: imageInput,
                displayOrder: prev.length,
                isMain: prev.length === 0,
                productId: 0,
                variantId: variantId,
            }]);
        setImageInput("");
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const clearImages = () => setImages([]);

    return {
        imageInput,
        setImageInput,
        images,
        variantId,
        setVariantId,
        addImage,
        removeImage,
        clearImages,
        setImages,
    };
}
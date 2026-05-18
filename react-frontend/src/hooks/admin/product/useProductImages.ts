import { useState } from "react";
import toast from "react-hot-toast";
import type { AddImagePayload } from "../../../api/admin/adminProductsApi";

export function useProductImages() {
    const [imageInput, setImageInput] = useState("");
    const [images, setImages] = useState<AddImagePayload[]>([]);
    const [productId, setProductId] = useState<number>(0);

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
                productId: productId,
                variantId: 0,
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
        productId,
        setProductId,
        addImage,
        removeImage,
        clearImages,
        setImages,
    };
}
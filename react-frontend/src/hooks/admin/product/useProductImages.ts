import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { AddImagePayload } from "../../../api/admin/adminProductsApi";

export function useProductImages(existingProductImages: AddImagePayload[]) {
    const [imageInput, setImageInput] = useState("");
    const [images, setImages] = useState<AddImagePayload[]>([]);

    useEffect(() => {
        setImages(existingProductImages);
    }, [existingProductImages])

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
        addImage,
        removeImage,
        clearImages,
        setImages,
    };
}
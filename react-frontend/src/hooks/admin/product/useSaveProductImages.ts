import { useState } from "react";
import toast from "react-hot-toast";
import { adminProductsApi, type AddImagePayload } from "../../../api/admin/adminProductsApi";

export function useSaveProductImages() {
    const [submittingImages, setSubmittingImages] = useState(false);

    const saveImages = async (productId: number | null, productImages: AddImagePayload[]) => {
        if (!productId) {
            toast.error("Please save the product first before adding images.");
            return;
        }

        if (productImages.length === 0) {
            toast.error("Please add at least one image URL.");
            return;
        }

        setSubmittingImages(true);
        try {
            const payload: AddImagePayload[] = productImages.map((img, idx) => ({
                // imageUrl: img.imageUrl,
                ...img,
                displayOrder: idx,
                isMain: idx === 0,
                productId,
                variantId: 0,
            }));

            await adminProductsApi.addProductImages(payload);
            toast.success("Product images saved!");
        } catch {
            toast.error("Failed to save product images.");
        } finally {
            setSubmittingImages(false);
        }
    };

    return { submittingImages, saveImages };
}
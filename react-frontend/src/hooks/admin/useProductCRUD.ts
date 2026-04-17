import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { adminProductsApi } from "../../api/admin/adminProductsApi";
import type { ProductFormData } from "./useProductForm";

interface UseProductCRUDReturn {
  submitting: boolean;
  handleSubmit: (
    formData: ProductFormData,
    editingId: number | null,
    validateForm: () => boolean,
    // onSuccess: () => void,
  ) => Promise<void>;
  handleDelete: (id: number | string) => Promise<void>;
}
 
/**
 * Handles create, update, and delete API calls for products.
 * Receives form data and callbacks — has no local form state.
 */
export const useProductCRUD = (): UseProductCRUDReturn => {
  const [submitting, setSubmitting] = useState(false);
 
  const handleSubmit = useCallback(async (
    formData: ProductFormData,
    editingId: number | null,
    validateForm: () => boolean,
    // onSuccess: () => void,
  ) => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }
 
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        price: parseFloat(String(formData.price)),
        imageUrl: formData.images[0] ?? "",
        imgUrl: formData.images[0] ?? "",
        imgUrls: formData.images,
        categoryId: Number(formData.categoryId),
        options: formData.selectedOptionValueIds.map((id) => ({
          optionId: 0,     // backend resolves from valueId
          valueId: id,
        })),
      };
 
      if (editingId) {
        await adminProductsApi.updateProductById(editingId, payload);
        toast.success("Product updated successfully!");
      } else {
        await adminProductsApi.createProduct(payload);
        toast.success("Product created successfully!");
      }
 
      // onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }, []);
 
  const handleDelete = useCallback(async (
    id: number | string,
    // onSuccess: () => void,
  ) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await adminProductsApi.deleteProduct(id);
      toast.success("Product deleted!");
      // onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    }
  }, []);
 
  return { submitting, handleSubmit, handleDelete };
};
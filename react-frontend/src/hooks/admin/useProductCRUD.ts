import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { adminProductsApi } from "../../api/admin/adminProductsApi";
import type { ProductFormData } from "./useProductForm";

const mapPayload = (form: ProductFormData) => ({
  name: form.name.trim(),
  slug: form.slug.trim(),
  shortDescription: form.shortDescription.trim(),
  description: form.description.trim(),
  price: Number(form.price),
  imageUrl: form.images[0] ?? "",
  imageUrls: form.images,
  categoryId: Number(form.categoryId),
  selectedOptionValueIds: form.selectedOptionValueIds,
});

export const useProductCRUD = (onRefetch: () => void) => {
  const [submitting, setSubmitting] = useState(false);

  const createOrUpdate = useCallback(
    async (form: ProductFormData, editingId: number | null) => {
      setSubmitting(true);
      try {
        const payload = mapPayload(form);

        if (editingId) {
          await adminProductsApi.updateProductById(editingId, payload);
          toast.success("Product updated successfully!");
        } else {
          await adminProductsApi.createProduct(payload);
          toast.success("Product created successfully!");
        }

        onRefetch();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      } finally {
        setSubmitting(false);
      }
    },
    [onRefetch]
  );

  const handleDelete = useCallback(async (id: number | string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await adminProductsApi.deleteProduct(id);
      toast.success("Deleted");
      onRefetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  }, [onRefetch]);

  return {
    submitting,
    createOrUpdate,
    handleDelete,
  };
};
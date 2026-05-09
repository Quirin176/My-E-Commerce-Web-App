import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { productvariantApi } from "../../api/products/productvariantApi";
import type { ProductVariant, ProductVariantForm } from "../../types/models/products/ProductVariant";
import { EMPTY_VARIANT_FORM } from "../../types/models/products/ProductVariant";

export const useProductVariants = (productId: number | null) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchVariants = useCallback(async (pid?: number | null) => {
    const id = pid ?? productId;
    if (!id) { setVariants([]); return; }
    setLoading(true);
    try {
      const data = await productvariantApi.getByProductId(id);
      setVariants(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load variants");
      setVariants([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // ── Save (create or update) ────────────────────────────────────────────────

  const saveVariant = useCallback(async (
    form: ProductVariantForm,
    pid: number,
  ): Promise<boolean> => {
    // Basic validation
    if (!form.variantName.trim()) { toast.error("Variant name is required"); return false; }
    if (!form.sku.trim())         { toast.error("SKU is required");           return false; }
    if (Number(form.price) <= 0)  { toast.error("Price must be > 0");         return false; }
    if (Number(form.stock) < 0)   { toast.error("Stock cannot be negative");  return false; }

    const payload = {
      variantName:   form.variantName.trim(),
      sku:           form.sku.trim(),
      price:         Number(form.price),
      originalPrice: Number(form.originalPrice) || Number(form.price),
      stock:         Number(form.stock),
      imageUrl:      form.imageUrl.trim() || undefined,
      productId:     pid,
    };

    try {
      if (form.id) {
        const updated = await productvariantApi.update(form.id, payload);

        // Re-sync option-value links: delete all then re-add
        const existing = await productvariantApi.getOptionValuesByVariant(form.id);
        await Promise.all(
          (existing as { productOptionValueId: number }[]).map(e =>
            productvariantApi.unlinkOptionValue(form.id!, e.productOptionValueId)
          )
        );
        await Promise.all(
          form.optionValueIds.map(ovId =>
            productvariantApi.linkOptionValue(form.id!, ovId)
          )
        );

        setVariants(prev => prev.map(v => v.id === form.id ? updated : v));
        toast.success("Variant updated!");
      } else {
        const created: ProductVariant = await productvariantApi.create(payload);

        await Promise.all(
          form.optionValueIds.map(ovId =>
            productvariantApi.linkOptionValue(created.id, ovId)
          )
        );

        setVariants(prev => [...prev, created]);
        toast.success("Variant created!");
      }
      return true;
    } catch {
      toast.error("Failed to save variant");
      return false;
    }
  }, []);

  // ── Delete ─────────────────────────────────────────────────────────────────

  const deleteVariant = useCallback(async (id: number): Promise<void> => {
    if (!window.confirm("Delete this variant? This cannot be undone.")) return;
    try {
      await productvariantApi.delete(id);
      setVariants(prev => prev.filter(v => v.id !== id));
      toast.success("Variant deleted");
    } catch {
      toast.error("Failed to delete variant");
    }
  }, []);

  return {
    variants,
    loading,
    fetchVariants,
    saveVariant,
    deleteVariant,
    emptyForm: EMPTY_VARIANT_FORM,
  };
};
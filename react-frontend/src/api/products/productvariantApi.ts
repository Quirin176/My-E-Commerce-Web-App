import { apiClient } from "../apiClient";

export const productvariantApi = {

  // ── Queries ──────────────────────────────────────────────────────────────

  async getById(id: number | string) {
    const res = await apiClient.get(`/productvariants/id/${id}`);
    return res.data;
  },

  async getAll() {
    const res = await apiClient.get("/productvariants");
    return res.data;
  },

  async getByProductId(productId: number | string) {
    const res = await apiClient.get(`/productvariants/product/${productId}`);
    return res.data;
  },

  // ── Variant ↔ OptionValue links ──────────────────────────────────────────

  async getOptionValuesByVariant(variantId: number | string) {
    const res = await apiClient.get(`/productvariantoptionvalue/variant/${variantId}`);
    return res.data;
  },

  async linkOptionValue(variantId: number, optionValueId: number) {
    const res = await apiClient.post("/productvariantoptionvalue", {
      productVariantId: variantId,
      productOptionValueId: optionValueId,
    });
    return res.data;
  },

  async unlinkOptionValue(variantId: number, optionValueId: number) {
    const res = await apiClient.delete(`/productvariantoptionvalue/${variantId}/${optionValueId}`);
    return res.data;
  },
};
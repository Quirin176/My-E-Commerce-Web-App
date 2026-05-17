import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { adminProductsApi, type AddImagePayload, type ProductVariantPayload, } from "../../../api/admin/adminProductsApi";
import type { ProductOption } from "../../../types/models/products/ProductOption";
import type { VariantRow } from "./ProductVariantsSection";

interface ProductVariantFormProps {
  mode: "create" | "edit";
  productId: number;
  filters: ProductOption[];
  row: VariantRow;
  onSaveSuccess: (savedRow: VariantRow) => void;
}

export default function ProductVariantForm({
  mode,
  productId,
  filters,
  row,
  onSaveSuccess,
}: ProductVariantFormProps) {
  // ── Local form state — seeded from the row ─────────────────────────────────
  const [variantName, setVariantName] = useState(row.variantName);
  const [sku, setSku] = useState(row.sku);
  const [price, setPrice] = useState<number>(row.price);
  const [originalPrice, setOriginalPrice] = useState<number>(row.originalPrice);
  const [stock, setStock] = useState<number>(row.stock);
  const [imageInput, setImageInput] = useState("");
  const [imageUrls, setImageUrls] = useState<AddImagePayload[]>(row.imageUrls ?? []);
  const [localOptionValueIds, setLocalOptionValueIds] = useState<number[]>(row.optionValueIds ?? []);
  const [submitting, setSubmitting] = useState(false);

  // Re-seed whenever the row changes (e.g. user collapses and expands a different row)
  useEffect(() => {
    setVariantName(row.variantName);
    setSku(row.sku);
    setPrice(row.price);
    setOriginalPrice(row.originalPrice);
    setStock(row.stock);
    setImageUrls(row.imageUrls ?? []);
    setLocalOptionValueIds(row.optionValueIds ?? []);
  }, [row.key]);

  // ── Resolve option value labels from filters for read-only display ──────────
  const attributeTags: { optionName: string; value: string }[] = filters.flatMap((opt) =>
    opt.optionValues
      .filter((v) => row.optionValueIds.includes(v.id))
      .map((v) => ({ optionName: opt.optionName, value: v.value }))
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    if (imageUrls.some((i) => i.ImageUrl === url)) {
      toast.error("Image URL already added");
      return;
    }
    setImageUrls((prev) => [
      ...prev,
      {
        ImageUrl: url,
        DisplayOrder: prev.length,
        IsMain: prev.length === 0, // first image is main
        ProductId: null,
        VariantId: row.serverId ?? null,
      },
    ]);
    setImageInput("");
  };

  const removeImage = (idx: number) =>
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    if (!variantName.trim()) { toast.error("Variant name is required"); return false; }
    if (!sku.trim()) { toast.error("SKU is required"); return false; }
    if (Number(price) <= 0) { toast.error("Price must be greater than 0"); return false; }
    return true;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: ProductVariantPayload = {
      variantName: variantName.trim(),
      sku: sku.trim(),
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      stock: Number(stock),
      productId,
      imageUrl: imageUrls[0]?.ImageUrl ?? "",
      imageUrls,
      optionValueIds: localOptionValueIds,
    };

    setSubmitting(true);
    try {
      if (mode === "edit" && row.serverId) {
        await adminProductsApi.updateVariant(row.serverId, payload);
        toast.success("Variant updated!");
      } else {
        await adminProductsApi.createVariant(productId, payload);
        toast.success("Variant created!");
      }

      // Bubble updated data back to the parent so it can update its row list
      onSaveSuccess({
        ...row,
        variantName: variantName.trim(),
        label: variantName.trim(),
        sku: sku.trim(),
        price: Number(price),
        originalPrice: Number(originalPrice) || Number(price),
        stock: Number(stock),
        imageUrls,
        optionValueIds: row.optionValueIds,
      });
    } catch (err) {
      console.error("Failed to save variant", err);
      toast.error("Failed to save variant");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Styles ─────────────────────────────────────────────────────────────────
  const inputCls =
    "w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 transition bg-white";

  return (
    <div className="space-y-4">
      {/* Name + SKU */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Variant Name <span className="text-red-500">*</span>
          </label>
          <input
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
            placeholder="e.g. Red / XL"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. PROD-RED-XL"
            className={`${inputCls} font-mono`}
          />
        </div>
      </div>

      {/* Prices + Stock */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Original Price
          </label>
          <input
            type="number"
            min={0}
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Number(e.target.value))}
            placeholder="Strike-through price"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Sale Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Selling price"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Stock
          </label>
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="0"
            className={inputCls}
          />
        </div>
      </div>

      {/* Image URL input */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Add Image URL
        </label>
        <div className="flex gap-2">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImage();
              }
            }}
            placeholder="https://example.com/image.jpg"
            className={`${inputCls} flex-1`}
          />
          <button
            type="button"
            onClick={addImage}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shrink-0 flex items-center gap-1"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {imageUrls.map((img, idx) => (
              <div key={idx} className="relative group w-16 h-16">
                <img
                  src={img.ImageUrl}
                  alt=""
                  className={`w-full h-full object-cover rounded border-2 ${img.IsMain ? "border-blue-500" : "border-gray-200"
                    }`}
                />
                {img.IsMain && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-white text-[9px] bg-blue-500 rounded-b">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Read-only attribute combination display */}
      {attributeTags.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">
            Attributes
          </label>
          <div className="flex flex-wrap gap-2">
            {attributeTags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border-2 border-blue-200 bg-blue-50 text-blue-800 text-xs font-medium"
              >
                <span className="text-blue-400">{tag.optionName}:</span>
                {tag.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Saving…"
            : mode === "edit" && row.serverId
              ? "Update Variant"
              : "Create Variant"}
        </button>
      </div>
    </div>
  );
}
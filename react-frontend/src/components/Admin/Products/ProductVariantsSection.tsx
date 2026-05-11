import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, PackageOpen } from "lucide-react";
import type { ProductVariant, ProductVariantForm } from "../../../types/models/products/ProductVariant";
import { EMPTY_VARIANT_FORM } from "../../../types/models/products/ProductVariant";
import type { ProductOption } from "../../../types/models/products/ProductOption";

interface Props {
  variants: ProductVariant[];
  filters: ProductOption[];
  isViewMode: boolean;
  productId: number | null;
  onSave: (form: ProductVariantForm, productId: number) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
}

export default function ProductVariantsSection({
  variants, filters, isViewMode, productId, onSave, onDelete,
}: Props) {
  const [editingForm, setEditingForm] = useState<ProductVariantForm | null>(null);
  const [saving, setSaving] = useState(false);

  const startAdd = () =>
    setEditingForm({ ...EMPTY_VARIANT_FORM });

  const startEdit = (v: ProductVariant) =>
    setEditingForm({
      id: v.id,
      variantName: v.variantName,
      sku: v.sku,
      price: v.price,
      originalPrice: v.originalPrice,
      stock: v.stock,
      imageUrl: v.imageUrl ?? "",
      optionValueIds: [],
    });

  const cancel = () => setEditingForm(null);

  const handleSave = async () => {
    if (!editingForm || !productId) return;
    setSaving(true);
    const ok = await onSave(editingForm, productId);
    setSaving(false);
    if (ok) setEditingForm(null);
  };

  const setField = <K extends keyof ProductVariantForm>(
    key: K, val: ProductVariantForm[K]
  ) => setEditingForm(prev => prev ? { ...prev, [key]: val } : prev);

  const toggleOptionValue = (ovId: number) => {
    if (!editingForm) return;
    const ids = editingForm.optionValueIds;
    setField(
      "optionValueIds",
      ids.includes(ovId) ? ids.filter(x => x !== ovId) : [...ids, ovId]
    );
  };

  // Stock badge colour
  const stockBadge = (stock: number) => {
    if (stock === 0) return "bg-red-100 text-red-700";
    if (stock <= 5) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="border-2 border-black rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-black flex items-center gap-2">
          <PackageOpen size={18} />
          Product Variants
          <span className="text-sm font-normal text-gray-500">({variants.length})</span>
        </h3>

        {!isViewMode && !editingForm && (
          <button
            onClick={startAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={15} /> Add Variant
          </button>
        )}
      </div>

      {/* Existing variant rows */}
      {variants.length > 0 ? (
        <div className="space-y-2">
          {variants.map(v => (
            <div
              key={v.id}
              className="flex items-center gap-3 px-4 py-3 border rounded-lg bg-gray-50 text-sm"
            >
              {/* Image thumbnail */}
              {v.imageUrl ? (
                <img
                  src={v.imageUrl}
                  alt={v.variantName}
                  className="w-10 h-10 object-cover rounded border shrink-0"
                  onError={e => { (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/40?text=?"; }}
                />
              ) : (
                <div className="w-10 h-10 rounded border bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                  ?
                </div>
              )}

              {/* Name + SKU */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-black truncate">{v.variantName}</p>
                <p className="text-xs text-gray-500">SKU: {v.sku}</p>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className="font-bold text-blue-700">{Number(v.price).toLocaleString("vi-VN")} ₫</p>
                {v.originalPrice > v.price && (
                  <p className="text-xs line-through text-gray-400">{Number(v.originalPrice).toLocaleString("vi-VN")} ₫</p>
                )}
              </div>

              {/* Stock */}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${stockBadge(v.stock)}`}>
                {v.stock === 0 ? "Out of stock" : `${v.stock} in stock`}
              </span>

              {/* Actions */}
              {!isViewMode && (
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(v)}
                    className="p-1.5 rounded border text-blue-600 hover:bg-blue-50 transition"
                    title="Edit variant"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(v.id)}
                    className="p-1.5 rounded border text-red-600 hover:bg-red-50 transition"
                    title="Delete variant"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">No variants yet.</p>
      )}

      {/* Inline add / edit form */}
      {editingForm && (
        <div className="border-2 border-blue-400 rounded-xl p-4 bg-blue-50 space-y-4">
          <p className="font-semibold text-blue-800 text-sm">
            {editingForm.id ? "Edit Variant" : "New Variant"}
          </p>

          {/* Row 1: name + SKU */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Variant Name</label>
              <input
                value={editingForm.variantName}
                onChange={e => setField("variantName", e.target.value)}
                placeholder="e.g. 16GB / 512GB Silver"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">SKU</label>
              <input
                value={editingForm.sku}
                onChange={e => setField("sku", e.target.value)}
                placeholder="e.g. LAP-001-16-512"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 2: prices + stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Original Price</label>
              <input
                type="number"
                min={0}
                value={editingForm.originalPrice}
                onChange={e => setField("originalPrice", e.target.value)}
                placeholder="Strike-through price"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Variant Price</label>
              <input
                type="number"
                min={0}
                value={editingForm.price}
                onChange={e => setField("price", e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                min={0}
                value={editingForm.stock}
                onChange={e => setField("stock", e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Image URL Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={form.formData.thumbnailUrl}
              onChange={(e) => form.updateField("thumbnailUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={form.addImageUrl}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Add Image
            </button>
          </div>
          <img
            src={form.formData.thumbnailUrl}
            className="w-32 h-32 object-cover rounded-lg border-2 border-black"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/96?text=No+Image';
            }}
          />

          {form.formErrors.imageUrl && (
            <p className="text-red-500 text-sm mb-3 flex items-center gap-1">
              <AlertCircle size={16} /> {form.formErrors.imageUrl}
            </p>
          )}

          {/* Images List */}
          {allImages.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-black mb-3">
                Added Images ({allImages.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-10 gap-3">
                {allImages.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded-lg border-2 border-black"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/96?text=No+Image';
                      }}
                    />
                    {/* Image Number Badge */}
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {idx + 1}
                    </span>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.removeImageUrl(idx);
                      }}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 z-10"
                      title={`Remove Image ${idx + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Check size={15} /> {saving ? "Saving…" : "Save Variant"}
            </button>
            <button
              onClick={cancel}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition"
            >
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
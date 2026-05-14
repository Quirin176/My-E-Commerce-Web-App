import { useEffect, useState } from "react";
import { Plus, PackageOpen, ChevronDown, ChevronUp, ImagePlus, RefreshCw, X } from "lucide-react";
import { adminProductsApi } from "../../../api/admin/adminProductsApi";
import type { ProductOption } from "../../../types/models/products/ProductOption";

export interface VariantRow {
  key: string;
  label: string;
  variantName: string;
  sku: string;
  originalPrice: string;
  price: string;
  stock: string;
  imageUrls: { url: string, displayOrder: number }[];
  imageInput: string;
  open: boolean;
  optionValueIds: number[];
  serverId?: number;
}

export interface SkuContext {
  categoryName: string;
  productName: string;
}

interface Props {
  productId: string | number;
  filters: ProductOption[];
  selectedOptionValueIds: number[];
  mode: string;
  onChange: (rows: VariantRow[]) => void;
  initialRows?: VariantRow[];
  skuContext: SkuContext;
}

function toSkuPart(str: string): string {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")   // strip accents
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")        // keep only alphanum
    .slice(0, 8);                       // max 8 chars per part
}

function buildSku(context: SkuContext, attrValues: string[]): string {
  const cat = toSkuPart(context.categoryName) || "CAT";
  const prod = toSkuPart(context.productName) || "PROD";
  const attrs = attrValues
    .map((v) => toSkuPart(v))
    .filter(Boolean)
    .join("");
  return `${cat}-${prod}-${attrs}`;
}

/** Cartesian product of arrays */
function cartesian<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]];
  return arrays.reduce<T[][]>(
    (acc, arr) => acc.flatMap((combo) => arr.map((item) => [...combo, item])),
    [[]]
  );
}

function buildLabel(optionValueIds: number[], filters: ProductOption[]): string {
  const parts: string[] = [];
  for (const opt of filters) {
    for (const val of opt.optionValues) {
      if (optionValueIds.includes(val.id)) {
        parts.push(val.value);
      }
    }
  }
  return parts.join(" / ") || "Variant";
}

function buildAttrValues(optionValueIds: number[], filters: ProductOption[]): string[] {
  const parts: string[] = [];
  for (const opt of filters)
    for (const val of opt.optionValues)
      if (optionValueIds.includes(val.id)) parts.push(val.value);
  return parts;
}

/** Given a list of selected IDs and the full filter options, group IDs by option */
function groupByOption(selectedIds: number[], filters: ProductOption[]): number[][] {
  const groups: number[][] = [];
  for (const opt of filters) {
    const matchingIds = opt.optionValues.map((v) => v.id).filter((id) => selectedIds.includes(id));
    if (matchingIds.length > 0) groups.push(matchingIds);
  }
  return groups;
}

/** Generate variant rows from selected option value IDs */
function generateRows(
  selectedIds: number[],
  filters: ProductOption[],
  existingRows: VariantRow[],
  skuContext: SkuContext
): VariantRow[] {
  const groups = groupByOption(selectedIds, filters);
  if (groups.length === 0) return [];

  const combinations = cartesian(groups);

  return combinations.map((combo) => {
    const key = combo.slice().sort((a, b) => a - b).join("-");
    const label = buildLabel(combo, filters);
    const existing = existingRows.find((r) => r.key === key);
    if (existing) return existing;

    const attrValues = buildAttrValues(combo, filters);
    const sku = buildSku(skuContext, attrValues);

    return {
      key,
      label,
      variantName: label,
      sku,
      originalPrice: "",
      price: "",
      stock: "",
      imageUrls: [],
      imageInput: "",
      open: false,
      optionValueIds: combo,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductVariantsSection({
  productId,
  filters,
  selectedOptionValueIds,
  mode,
  onChange,
  initialRows = [],
  skuContext,
}: Props) {
  const [rows, setRows] = useState<VariantRow[]>(initialRows);
  const [submittingKey, setSubmittingKey] = useState<string | null>(null);

  // Re-generate rows whenever the selected option values change
  useEffect(() => {
    setRows((prev) => {
      const next = generateRows(selectedOptionValueIds, filters, prev, skuContext);
      onChange(next);
      return next;
    });
  }, [selectedOptionValueIds.join(","), filters.length]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const update = (key: string, patch: Partial<VariantRow>) => {
    setRows((prev) => {
      const next = prev.map((r) => (r.key === key ? { ...r, ...patch } : r));
      onChange(next);
      return next;
    });
  };

  const toggleOpen = (key: string) =>
    update(key, { open: !rows.find((r) => r.key === key)!.open });

  const removeRow = (key: string) => {
    setRows((prev) => {
      const next = prev.filter((r) => r.key !== key);
      onChange(next);
      return next;
    });
  };

  const regenerateSku = (row: VariantRow) => {
    const attrValues = buildAttrValues(row.optionValueIds, filters);
    const sku = buildSku(skuContext, attrValues);
    update(row.key, { sku });
  };

  /** Regenerate SKUs for ALL rows at once */
  const regenerateAllSkus = () => {
    setRows((prev) => {
      const next = prev.map((r) => {
        const attrValues = buildAttrValues(r.optionValueIds, filters);
        return { ...r, sku: buildSku(skuContext, attrValues) };
      });
      onChange(next);
      return next;
    });
  };

  const addImage = (key: string) => {
    const row = rows.find((r) => r.key === key);
    if (!row) return;

    const url = row.imageInput.trim();
    if (!url) return;
    if (row.imageUrls.some(i => i.url === url)) return;

    update(key, { imageUrls: [...row.imageUrls, { url, displayOrder: row.imageUrls.length + 1 }], imageInput: "" });
  };

  const removeImage = (key: string, idx: number) => {
    const row = rows.find((r) => r.key === key);
    if (!row) return;
    update(key, { imageUrls: row.imageUrls.filter((_, i) => i !== idx) });
  };

  const handleUpdateVariant = async (row: VariantRow) => {
    if (!row.serverId) {
      console.warn("No serverId on row — cannot update", row);
      return;
    }

    setSubmittingKey(row.key);
    try {
      const payload = {
        variantName: row.variantName.trim() || row.label,
        sku: row.sku.trim(),
        price: Number(row.price),
        originalPrice: Number(row.originalPrice) || Number(row.price),
        stock: Number(row.stock),
        productId: Number(productId),
        imageUrls: row.imageUrls.map((img, i) => ({
          imageUrl: img.url,
          displayOrder: img.displayOrder ?? i,
          isMain: i === 0,
        })),
        optionValueIds: row.optionValueIds,
      };

      await adminProductsApi.updateVariant(row.serverId, payload);
    } catch (err) {
      console.error("Failed to update variant", err);
    } finally {
      setSubmittingKey(null);
    }
  }

  // ── Early exit ─────────────────────────────────────────────────────────────

  if (rows.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-sm text-gray-400">
        <PackageOpen size={28} className="mx-auto mb-2 opacity-40" />
        Select option values above to auto-generate variants.
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="border-2 border-black rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900 text-white">
        <div className="flex items-center gap-2 font-bold text-sm">
          <PackageOpen size={16} />
          Product Variants
          <span className="text-gray-400 font-normal">({rows.length})</span>
        </div>

        {/* Regenerate all SKUs */}
        {/* {!isViewMode && (
          <button
            type="button"
            onClick={regenerateAllSkus}
            title="Re-generate SKUs for all variants from current category / product name"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition"
          >
            <RefreshCw size={13} />
            Regenerate All SKUs
          </button>
        )} */}
      </div>

      {/* SKU format hint */}
      <div className="px-5 py-2 bg-gray-800 text-gray-400 text-xs font-mono border-b border-gray-700">
        SKU format:&nbsp;
        <span className="text-yellow-300">{toSkuPart(skuContext.categoryName) || "CAT"}</span>
        <span className="text-gray-500">-</span>
        <span className="text-blue-300">{toSkuPart(skuContext.productName) || "PROD"}</span>
        <span className="text-gray-500">-</span>
        <span className="text-green-300">ATTRIBUTES</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {rows.map((row) => (
          <div key={row.key} className="bg-white">
            {/* ── Row header (collapsed) ── */}
            <div
              className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition select-none"
              onClick={() => toggleOpen(row.key)}
            >
              {/* Expand icon */}
              <button type="button" className="text-gray-400 shrink-0" tabIndex={-1}>
                {row.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Variant label */}
              <span className="flex-1 font-semibold text-sm text-gray-800">
                {row.label}
              </span>

              {/* SKU badge */}
              {row.sku && (
                <span className="hidden sm:inline text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 shrink-0">
                  {row.sku}
                </span>
              )}

              {/* Quick stats */}
              <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                {row.price && (
                  <span className="font-bold text-blue-700">
                    {Number(row.price).toLocaleString("vi-VN")} ₫
                  </span>
                )}
                {row.stock !== "" && (
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold
                      ${Number(row.stock) === 0 ? "bg-red-100 text-red-700" :
                        Number(row.stock) <= 5 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                      }`}
                  >
                    {Number(row.stock) === 0 ? "Out of stock" : `${row.stock} in stock`}
                  </span>
                )}
                {row.imageUrls.length > 0 && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <ImagePlus size={12} />
                    {row.imageUrls.length}
                  </span>
                )}
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeRow(row.key); }}
                className="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0"
                title="Remove variant"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Expanded form ── */}
            {row.open && (
              <div className="px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-200 space-y-4">

                {/* Row 1: name + SKU */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Variant Name">
                    <input
                      value={row.variantName}
                      onChange={(e) => update(row.key, { variantName: e.target.value })}
                      placeholder="e.g. Red / XL"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="SKU">
                    <div className="flex gap-2">
                      <input
                        value={row.sku}
                        onChange={(e) => update(row.key, { sku: e.target.value })}
                        placeholder="Auto-generated"
                        className={`${inputCls} flex-1 font-mono`}
                      />
                      <button
                        type="button"
                        onClick={() => regenerateSku(row)}
                        title="Re-generate SKU for this variant"
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition shrink-0 text-gray-600"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </Field>
                </div>

                {/* Row 2: prices + stock */}
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Original Price">
                    <input
                      type="number"
                      min={0}
                      value={row.originalPrice}
                      onChange={(e) => update(row.key, { originalPrice: e.target.value })}
                      placeholder="Strike-through price"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Sale Price">
                    <input
                      type="number"
                      min={0}
                      value={row.price}
                      onChange={(e) => update(row.key, { price: e.target.value })}
                      placeholder="Selling price"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Stock">
                    <input
                      type="number"
                      min={0}
                      value={row.stock}
                      onChange={(e) => update(row.key, { stock: e.target.value })}
                      placeholder="0"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Row 3: image URL input */}
                <Field label="Add Image URL">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={row.imageInput}
                      onChange={(e) => update(row.key, { imageInput: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(row.key); } }}
                      placeholder="https://example.com/image.jpg"
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={() => addImage(row.key)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shrink-0"
                    >
                      <Plus size={15} /> Add
                    </button>
                  </div>
                </Field>

                {/* Image grid */}
                {row.imageUrls.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Images ({row.imageUrls.length})
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {row.imageUrls.map((image, idx) => (
                        <div key={idx} className="relative group w-20 h-20">
                          <img
                            src={image.url}
                            alt={`Variant img ${idx + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                          />
                          {/* index badge */}
                          <span className="absolute bottom-0.5 left-0.5 bg-black/60 text-white text-[9px] px-1 rounded">
                            {idx + 1}
                          </span>
                          {/* remove */}
                          <button
                            type="button"
                            onClick={() => removeImage(row.key, idx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            title="Remove image"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mode === "edit" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleUpdateVariant(row)}
                      disabled={submittingKey === row.key}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingKey === row.key ? "Saving..." : "Update Variant"}
                    </button>                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 transition bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
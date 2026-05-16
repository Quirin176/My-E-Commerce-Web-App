import { useEffect, useState } from "react";
import { PackageOpen, ChevronDown, ChevronUp, ImagePlus, X } from "lucide-react";
import type { VariantImagePayload } from "../../../api/admin/adminProductsApi";
import type { ProductOption } from "../../../types/models/products/ProductOption";
import ProductVariantForm from "./ProductVariantForm";

export interface VariantRow {
  key: string;
  label: string;
  variantName: string;
  sku: string;
  originalPrice: number;
  price: number;
  stock: number;
  imageUrls: VariantImagePayload[];
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
  productId: number;
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

  const generatedRows = combinations.map((combo) => {
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
      originalPrice: 0,
      price: 0,
      stock: 0,
      imageUrls: [],
      imageInput: "",
      open: false,
      optionValueIds: combo,
    };
  });

  const manualRows = existingRows.filter(
    (row) => row.key.startsWith("manual-") || row.optionValueIds.length === 0
  );

  return [...generatedRows, ...manualRows];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProductVariantsSection({
  mode,
  productId,
  filters,
  selectedOptionValueIds,
  onChange,
  initialRows = [],
  skuContext,
}: Props) {
  const [rows, setRows] = useState<VariantRow[]>(initialRows);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  // Re-generate rows whenever the selected option values change
  useEffect(() => {
    setRows((prev) => {
      const next = generateRows(selectedOptionValueIds, filters, prev, skuContext);
      onChange(next);
      return next;
    });
  }, [selectedOptionValueIds.join(","), filters, skuContext.categoryName, skuContext.productName]);

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
                {row.stock !== 0 && (
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
                <ProductVariantForm
                  mode={mode}
                productId={productId}
                selectedOptionValueIds={selectedOptionValueIds}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

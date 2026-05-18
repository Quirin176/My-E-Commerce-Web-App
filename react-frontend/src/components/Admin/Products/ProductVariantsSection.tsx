import { useEffect, useState } from "react";
import { PackageOpen, ChevronDown, ChevronUp, ImagePlus, X } from "lucide-react";

import type { ProductOption } from "../../../types/models/products/ProductOption";
import type { VariantRow, SkuContext } from "../../../types/models/products/variantTypes";
import { generateRows } from "../../../utils/variantGenerators";
import { toSkuPart } from "../../../utils/variantGenerators";

import ProductVariantForm from "./ProductVariantForm";

interface Props {
  mode: string;
  autoGenerate: boolean;
  productId: number;
  filters: ProductOption[];
  selectedOptionValueIds: number[];
  onChange: (rows: VariantRow[]) => void;
  initialRows?: VariantRow[];
  skuContext: SkuContext;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductVariantsSection({
  mode,
  autoGenerate,
  productId,
  filters,
  selectedOptionValueIds,
  onChange,
  initialRows = [],
  skuContext,
}: Props) {
  const [rows, setRows] = useState<VariantRow[]>([]);

  // Re-generate rows whenever selected option values change
  useEffect(() => {
    if (!autoGenerate) {
      setRows(initialRows);
      return;
    }

    setRows((existingRows) => {
      const next = generateRows({
        selectedOptionValueIds,
        filters,
        existingRows,
        skuContext
      }
      );
      onChange(next);
      return next;
    });
  }, [
    autoGenerate,
    selectedOptionValueIds.join(","),
    filters,
    skuContext.categoryName,
    skuContext.productName,
  ]);

  // ── Row helpers ────────────────────────────────────────────────────────────

  const updateRow = (key: string, patch: Partial<VariantRow>) =>
    setRows((prev) => {
      const next = prev.map((r) => (r.key === key ? { ...r, ...patch } : r));
      onChange(next);
      return next;
    });

  const toggleOpen = (key: string) => {
    const row = rows.find((r) => r.key === key);
    if (row) updateRow(key, { open: !row.open });
  };

  const removeRow = (key: string) =>
    setRows((prev) => {
      const next = prev.filter((r) => r.key !== key);
      onChange(next);
      return next;
    });

  // Called by ProductVariantForm after a successful API save
  const handleSaveSuccess = (savedRow: VariantRow) => {
    updateRow(savedRow.key, { ...savedRow, open: false });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="border-2 border-black rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900 text-white">
        <div className="flex items-center gap-2 font-bold text-sm">
          <PackageOpen size={16} />
          Auto-generate Variants
          <span className="text-gray-400 font-normal">({rows.length})</span>
        </div>
        <div className="px-5 py-2 bg-gray-800 text-gray-400 text-xs font-mono border-b border-gray-700">
          SKU format:&nbsp;
          <span className="text-yellow-300">{toSkuPart(skuContext.categoryName) || "CAT"}</span>
          <span className="text-gray-500">-</span>
          <span className="text-blue-300">{toSkuPart(skuContext.productName) || "PROD"}</span>
          <span className="text-gray-500">-</span>
          <span className="text-green-300">ATTRIBUTES</span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {rows.map((row) => (
          <div key={row.key} className="bg-white">
            {/* ── Collapsed header ── */}
            <div
              className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition select-none"
              onClick={() => toggleOpen(row.key)}
            >
              {/* Expand icon */}
              <button type="button" className="text-gray-400 shrink-0" tabIndex={-1}>
                {row.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Label */}
              <span className="flex-1 font-semibold text-sm text-gray-800">{row.variantName}</span>

              {/* Server-saved badge */}
              {row.serverId && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-semibold shrink-0">
                  Saved
                </span>
              )}

              {/* SKU badge */}
              {row.sku && (
                <span className="hidden sm:inline text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200 shrink-0">
                  {row.sku}
                </span>
              )}

              {/* Quick stats */}
              <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                {row.price > 0 && (
                  <span className="font-bold text-blue-700">
                    {Number(row.price).toLocaleString("vi-VN")} ₫
                  </span>
                )}
                {row.stock !== 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold ${Number(row.stock) === 0
                      ? "bg-red-100 text-red-700"
                      : Number(row.stock) <= 5
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {Number(row.stock) === 0 ? "Out of stock" : `${row.stock} in stock`}
                  </span>
                )}
                {row.images.length > 0 && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <ImagePlus size={12} />
                    {row.images.length}
                  </span>
                )}
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeRow(row.key);
                }}
                className="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0"
                title="Remove variant"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Expanded form ── */}
            {row.open && (
              <div className="px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-200">
                <ProductVariantForm
                  mode={row.serverId ? "edit" : mode === "edit" ? "edit" : "create"}
                  productId={productId}
                  filters={filters}
                  row={row}
                  onSaveSuccess={handleSaveSuccess}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { AlertCircle, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { VariantRow, SkuContext } from "../../../types/models/products/variantTypes";
import type { ProductOption } from "../../../types/models/products/ProductOption";
import { generateRows } from "../../../utils/variantGenerators";
import { adminProductsApi } from "../../../api/admin/adminProductsApi";

import ToggleSwitch from "../../../components/ToggleSwitch";
import ProductVariantForm from "../../../components/Admin/Products/ProductVariantForm";
import toast from "react-hot-toast";

interface ProductVariantsTabProps {
    mode: string;
    productId: number | null;
    filters: ProductOption[];
    selectedOptionValueIds: number[];
    variants: VariantRow[];
    setVariants: React.Dispatch<React.SetStateAction<VariantRow[]>>;
    autoGenerate: boolean;
    setAutoGenerate: (val: boolean) => void;
    skuContext: SkuContext;
}

// ─── Blank row factory ────────────────────────────────────────────────────────

function blankRow(index: number): VariantRow {
    return {
        key: `new-${Date.now()}-${index}`,
        variantName: "",
        sku: "",
        originalPrice: 0,
        price: 0,
        stock: 0,
        images: [],
        imageInput: "",
        open: true,
        optionValueIds: [],
        serverId: 0,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductVariantsTab({
    mode,
    productId,
    filters,
    selectedOptionValueIds,
    variants,
    setVariants,
    autoGenerate,
    setAutoGenerate,
    skuContext,
}: ProductVariantsTabProps) {
    const navigate = useNavigate();

    // ── Auto-generate rows when toggle is on ──────────────────────────────────
    useEffect(() => {
        if (!autoGenerate) return;

        setVariants((existing) => {
            const next = generateRows({
                selectedOptionValueIds,
                filters,
                existingRows: existing,
                skuContext,
            });
            return next;
        });
    }, [
        autoGenerate,
        selectedOptionValueIds.join(","),
        filters,
        skuContext.categoryName,
        skuContext.productName,
    ]);

    // ── Row helpers ───────────────────────────────────────────────────────────

    const toggleOpen = (key: string) =>
        setVariants((prev) =>
            prev.map((r) => (r.key === key ? { ...r, open: !r.open } : r))
        );

    const removeRow = async (row: VariantRow) => {
        // If already saved on the server, delete it there too
        if (row.serverId) {
            if (!window.confirm(`Delete variant "${row.variantName}"? This cannot be undone.`)) return;
            try {
                await adminProductsApi.deleteVariant(row.serverId);
                toast.success("Variant deleted");
            } catch {
                toast.error("Failed to delete variant");
                return;
            }
        }
        setVariants((prev) => prev.filter((r) => r.key !== row.key));
    };

    const handleSaveSuccess = (savedRow: VariantRow) =>
        setVariants((prev) =>
            prev.map((r) => (r.key === savedRow.key ? { ...savedRow, open: false } : r))
        );

    const addBlankRow = () =>
        setVariants((prev) => [...prev, blankRow(prev.length)]);

    // ── Guard ─────────────────────────────────────────────────────────────────

    if (!productId) {
        return (
            <div className="space-y-4">
                <label className="text-2xl font-bold text-black">Product Variants</label>
                <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-800">
                    <AlertCircle size={20} className="shrink-0" />
                    <div>
                        <p className="font-semibold text-sm">Product not saved yet</p>
                        <p className="text-xs mt-0.5">
                            Go to the <strong>Attributes</strong> tab and click{" "}
                            <strong>Create Product</strong> first. Then come back here to add variants.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-4">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <label className="text-2xl font-bold text-black">
                    Product Variants
                    <span className="ml-2 text-base font-normal text-gray-500">
                        ({variants.length})
                    </span>
                </label>
                <ToggleSwitch
                    label="Auto-generate?"
                    checked={autoGenerate}
                    onChange={(val) => setAutoGenerate(val)}
                />
            </div>

            {/* Variant rows */}
            <div className="divide-y divide-gray-200 border-2 border-gray-200 rounded-xl overflow-hidden">
                {variants.length === 0 && (
                    <div className="py-12 text-center text-gray-400 text-sm">
                        No variants yet. Click <strong>Add Variant</strong> below to create one.
                    </div>
                )}

                {variants.map((row) => (
                    <div key={row.key} className="bg-white">
                        {/* ── Collapsed header ── */}
                        <div
                            className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 transition select-none"
                            onClick={() => toggleOpen(row.key)}
                        >
                            {/* Expand icon */}
                            <button
                                type="button"
                                className="text-gray-400 shrink-0"
                                tabIndex={-1}
                            >
                                {row.open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {/* Label */}
                            <span className="flex-1 font-semibold text-sm text-gray-800">
                                {row.variantName || (
                                    <span className="text-gray-400 italic">Unnamed variant</span>
                                )}
                            </span>

                            {/* Saved badge */}
                            {row.serverId ? (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-semibold shrink-0">
                                    Saved
                                </span>
                            ) : (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 font-semibold shrink-0">
                                    Unsaved
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
                                        {Number(row.stock) === 0
                                            ? "Out of stock"
                                            : `${row.stock} in stock`}
                                    </span>
                                )}
                            </div>

                            {/* Delete button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeRow(row);
                                }}
                                className="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0"
                                title="Remove variant"
                            >
                                <Trash2 size={15} />
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

            {/* Add variant button */}
            <button
                type="button"
                onClick={addBlankRow}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-400 text-blue-600 rounded-xl hover:bg-blue-50 transition text-sm font-semibold w-full justify-center"
            >
                <Plus size={16} />
                Add Variant
            </button>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/products")}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                >
                    Done / Skip
                </button>
            </div>
        </div>
    );
}
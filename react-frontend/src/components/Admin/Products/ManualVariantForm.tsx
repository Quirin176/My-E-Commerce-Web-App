import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import type { VariantRow, SkuContext } from "../../../components/Admin/Products/ProductVariantsSection";
import type { ProductOption } from "../../../types/models/products/ProductOption";

// ─── SKU helpers (mirrors ProductVariantsSection) ─────────────────────────────

function toSkuPart(str: string): string {
    return str
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "")
        .slice(0, 8);
}

function buildSku(context: SkuContext, attrValues: string[]): string {
    const cat = toSkuPart(context.categoryName) || "CAT";
    const prod = toSkuPart(context.productName) || "PROD";
    const attrs = attrValues.map(toSkuPart).filter(Boolean).join("");
    return `${cat}-${prod}-${attrs}`;
}

interface ManualVariantFormProps {
    filters: ProductOption[];
    selectedProductOptionValueIds: number[];
    skuContext: SkuContext;
    onAdd: (row: VariantRow) => void;
    onCancel: () => void;
}

export default function ManualVariantForm({
    filters,
    selectedProductOptionValueIds,
    skuContext,
    onAdd,
    onCancel,
}: ManualVariantFormProps) {
    const [variantName, setVariantName] = useState("");
    const [sku, setSku] = useState("");
    const [skuManuallyEdited, setSkuManuallyEdited] = useState(false);
    const [price, setPrice] = useState<number>(0);
    const [originalPrice, setOriginalPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [imageInput, setImageInput] = useState("");
    const [imageUrls, setImageUrls] = useState<{ url: string; displayOrder: number }[]>([]);

    // Start with nothing ticked — user picks the specific combination for this manual variant
    const [checkedIds, setCheckedIds] = useState<number[]>([]);

    // ── Derive only the option groups that have at least one product-selected value ──
    const visibleOptions: ProductOption[] = filters
        .map((opt) => ({
            ...opt,
            optionValues: opt.optionValues.filter((v) =>
                selectedProductOptionValueIds.includes(v.id)
            ),
        }))
        .filter((opt) => opt.optionValues.length > 0);

    // ── Auto-generate SKU whenever checkedIds or skuContext changes ───────────
    useEffect(() => {
        if (skuManuallyEdited) return;

        // Resolve value strings in filter order so the SKU is deterministic
        const attrValues = filters.flatMap((opt) =>
            opt.optionValues
                .filter((v) => checkedIds.includes(v.id))
                .map((v) => v.value)
        );

        setSku(buildSku(skuContext, attrValues));
    }, [checkedIds, skuContext.categoryName, skuContext.productName, skuManuallyEdited]);

    const toggleId = (id: number) =>
        setCheckedIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );

    const addImage = () => {
        const url = imageInput.trim();
        if (!url) return;
        if (imageUrls.some((i) => i.url === url)) return;
        setImageUrls((prev) => [...prev, { url, displayOrder: prev.length }]);
        setImageInput("");
    };

    const handleAdd = () => {
        if (!variantName.trim()) { toast.error("Variant name is required"); return; }
        if (!sku.trim()) { toast.error("SKU is required"); return; }
        if (Number(price) <= 0) { toast.error("Price must be > 0"); return; }

        const key = `manual-${Date.now()}`;
        const row: VariantRow = {
            key,
            label: variantName.trim(),
            variantName: variantName.trim(),
            sku: sku.trim(),
            originalPrice,
            price,
            stock,
            imageUrls: imageUrls.map((img, idx) => ({
                imageUrl: img.url,
                displayOrder: img.displayOrder,
                isMain: idx === 0,
                productId: null,
                variantId: null,
            })),
            imageInput: "",
            open: false,
            optionValueIds: checkedIds,
        };
        onAdd(row);
    };

    const inputCls =
        "w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 transition bg-white";

    return (
        <div className="border-2 border-blue-500 rounded-xl p-5 bg-blue-50 space-y-4">
            <h3 className="font-bold text-blue-800 text-sm uppercase tracking-wide">
                Add Variant Manually
            </h3>

            {/* Name + SKU */}
            <div className="grid grid-cols-3 gap-3">
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
                        {!skuManuallyEdited
                            ? <span className="ml-1 font-normal text-gray-400">(auto-generated)</span>
                            : (
                                <button
                                    type="button"
                                    onClick={() => setSkuManuallyEdited(false)}
                                    className="ml-2 font-normal text-blue-500 hover:underline"
                                >
                                    reset
                                </button>
                            )
                        }
                    </label>
                    <input
                        value={sku}
                        onChange={(e) => {
                            setSku(e.target.value);
                            setSkuManuallyEdited(true);
                        }}
                        placeholder="e.g. PROD-RED-XL"
                        className={`${inputCls} font-mono ${!skuManuallyEdited ? "bg-gray-50 text-gray-500" : ""}`}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Stock</label>
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
                                if (e.key === "Enter") { e.preventDefault(); addImage(); }
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
                                        src={img.url}
                                        alt=""
                                        className="w-full h-full object-cover rounded border-2 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageUrls((prev) => prev.filter((_, i) => i !== idx))
                                        }
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Attributes — only product-selected values, tickable */}
            {visibleOptions.length > 0 && (
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                        Attributes
                        <span className="ml-1 font-normal text-gray-400">
                            (pick the combination for this variant)
                        </span>
                    </label>
                    <div className="space-y-2">
                        {visibleOptions.map((opt) => (
                            <div key={opt.optionId}>
                                <p className="text-xs text-gray-500 mb-1">{opt.optionName}</p>
                                <div className="flex flex-wrap gap-2">
                                    {opt.optionValues.map((v) => {
                                        const checked = checkedIds.includes(v.id);
                                        return (
                                            <label
                                                key={v.id}
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 cursor-pointer text-xs font-medium transition select-none ${checked
                                                    ? "border-blue-500 bg-blue-100 text-blue-800"
                                                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleId(v.id)}
                                                    className="sr-only"
                                                />
                                                {v.value}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                    Add Variant
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
import { useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { adminProductsApi, type VariantImagePayload, type ProductVariantPayload } from "../../../api/admin/adminProductsApi";

interface ProductVariantFormProps {
    mode: string;
    productId: number;
    selectedOptionValueIds: number[];
    // onAdd: (row: VariantRow) => void;
    // onCancel: () => void;
}

export default function ProductVariantForm({
    mode,
    productId,
    selectedOptionValueIds,
    // onAdd,
    // onCancel
}: ProductVariantFormProps) {
    const [variantName, setVariantName] = useState("");
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [originalPrice, setOriginalPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [imageInput, setImageInput] = useState<string>("");
    const [imageUrls, setImageUrls] = useState<VariantImagePayload[]>([]);

    const [submitting, setSubmitting] = useState<boolean>(false);

    const addImage = () => {
        const url = imageInput.trim();
        if (!url) return;
        if (imageUrls.some((i) => i.imageUrl === url)) return;

        setImageUrls((prev) => [...prev, {
            imageUrl: url,
            displayOrder: prev.length,
            isMain: prev.length === 1,
            productId: Number(productId),
            variantId: Number(productId)
        }]);

        setImageInput("");
    };

    const handleAddVariant = async () => {
        if (!variantName.trim()) { toast.error("Variant name is required"); return; }
        if (!sku.trim()) { toast.error("SKU is required"); return; }
        if (Number(price) <= 0) { toast.error("Price must be > 0"); return; }

        const payload: ProductVariantPayload = {
            variantName: variantName.trim(),
            sku: sku.trim(),
            price: Number(price),
            originalPrice: Number(originalPrice) || Number(price),
            stock: Number(stock),
            productId: Number(productId),
            imageUrl: imageUrls[0]?.imageUrl ?? "",

            imageUrls: imageUrls,

            optionValueIds: selectedOptionValueIds,
        };

        await adminProductsApi.createVariant(productId, payload);
    };

    const handleUpdateVariant = async () => {
        if (!productId) {
            return;
        }

        setSubmitting(true);
        try {
            const payload: ProductVariantPayload = {
                variantName: variantName.trim(),
                sku: sku.trim(),
                price: Number(price),
                originalPrice: Number(originalPrice) || Number(price),
                stock: Number(stock),
                productId: Number(productId),
                imageUrl: imageUrls[0]?.imageUrl ?? "",

                imageUrls: imageUrls,

                optionValueIds: selectedOptionValueIds,
            };

            await adminProductsApi.updateVariant(productId, payload);
        } catch (err) {
            console.error("Failed to update variant", err);
        } finally {
            setSubmitting(false);
        }
    }

    const inputCls = "w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 transition bg-white";

    return (
        <div className="border-2 border-blue-500 rounded-xl p-5 bg-blue-50 space-y-4">
            <h3 className="font-bold text-blue-800 text-sm uppercase tracking-wide">Add Variant Manually</h3>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Variant Name *</label>
                    <input value={variantName} onChange={(e) => setVariantName(e.target.value)} placeholder="e.g. Red / XL" className={inputCls} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">SKU *</label>
                    <input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. PROD-RED-XL" className={`${inputCls} font-mono`} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price</label>
                    <input type="number" min={0} value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} placeholder="Strike-through price" className={inputCls} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Sale Price *</label>
                    <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Selling price" className={inputCls} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Stock</label>
                    <input type="number" min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))} placeholder="0" className={inputCls} />
                </div>
            </div>

            {/* Image URL input */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Add Image URL</label>
                <div className="flex gap-2">
                    <input
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                        placeholder="https://example.com/image.jpg"
                        className={`${inputCls} flex-1`}
                    />
                    <button type="button" onClick={addImage} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shrink-0 flex items-center gap-1">
                        <Plus size={14} /> Add
                    </button>
                </div>
                {imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {imageUrls.map((img, idx) => (
                            <div key={idx} className="relative group w-16 h-16">
                                <img src={img.imageUrl} alt="" className="w-full h-full object-cover rounded border-2 border-gray-200" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Option values */}
            {selectedOptionValueIds.length > 0 && (
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Attributes</label>
                    <div className="space-y-2">
                        {selectedOptionValueIds.map((opt) => (
                            <div key={opt.optionId}>
                                <p className="text-xs text-gray-500 mb-1">{opt.optionName}</p>
                                <div className="flex flex-wrap gap-2">
                                    {opt.optionValues.map((v) => (
                                        <label key={v.id} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 cursor-pointer text-xs font-medium transition ${selectedOptionValueIds.includes(v.id) ? "border-blue-500 bg-blue-100 text-blue-800" : "border-gray-300 bg-white text-gray-700"}`}>
                                            <input type="checkbox" checked={selectedOptionValueIds.includes(v.id)} className="sr-only" />
                                            {v.value}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mode === "create" ? (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => handleAddVariant()}
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Saving..." : "Create Variant"}
                    </button>
                </div>
            ) : (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => handleUpdateVariant()}
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Saving..." : "Update Variant"}
                    </button>
                </div>
            )}
        </div>
    );
}
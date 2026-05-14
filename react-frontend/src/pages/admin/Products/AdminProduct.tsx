import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, MoveRight, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { Tabs, Tab, Box } from "@mui/material";

import { useCategories } from "../../../hooks/products/useCategories";
import { useProductForm } from "../../../hooks/admin/useProductForm";
import { useProductFilters } from "../../../hooks/products/useProductFilters";

import { adminProductsApi, type ProductPayload, type ProductVariantPayload } from "../../../api/admin/adminProductsApi";
import { productApi } from "../../../api/products/productApi";

import ToggleSwitch from "../../../components/ToggleSwitch";
import ProductVariantsSection, { type VariantRow, type SkuContext } from "../../../components/Admin/Products/ProductVariantsSection";

// ─── Manual variant form ───────────────────────────────────────────────────────

interface ManualVariantFormProps {
    filters: ReturnType<typeof useProductFilters>["filters"];
    onAdd: (row: VariantRow) => void;
    onCancel: () => void;
}

function ManualVariantForm({ filters, onAdd, onCancel }: ManualVariantFormProps) {
    const [variantName, setVariantName] = useState("");
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [stock, setStock] = useState("");
    const [imageInput, setImageInput] = useState("");
    const [imageUrls, setImageUrls] = useState<{ url: string; displayOrder: number }[]>([]);
    const [selectedOptionValueIds, setSelectedOptionValueIds] = useState<number[]>([]);

    const toggleOptionValue = (id: number) => {
        setSelectedOptionValueIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

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
            originalPrice: originalPrice || price,
            price,
            stock,
            imageUrls,
            imageInput: "",
            open: false,
            optionValueIds: selectedOptionValueIds,
        };
        onAdd(row);
    };

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
                    <input type="number" min={0} value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Strike-through price" className={inputCls} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Sale Price *</label>
                    <input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Selling price" className={inputCls} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Stock</label>
                    <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" className={inputCls} />
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
                                <img src={img.url} alt="" className="w-full h-full object-cover rounded border-2 border-gray-200" />
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
            {filters.length > 0 && (
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Attributes</label>
                    <div className="space-y-2">
                        {filters.map((opt) => (
                            <div key={opt.optionId}>
                                <p className="text-xs text-gray-500 mb-1">{opt.optionName}</p>
                                <div className="flex flex-wrap gap-2">
                                    {opt.optionValues.map((v) => (
                                        <label key={v.id} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 cursor-pointer text-xs font-medium transition ${selectedOptionValueIds.includes(v.id) ? "border-blue-500 bg-blue-100 text-blue-800" : "border-gray-300 bg-white text-gray-700"}`}>
                                            <input type="checkbox" checked={selectedOptionValueIds.includes(v.id)} onChange={() => toggleOptionValue(v.id)} className="sr-only" />
                                            {v.value}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleAdd} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                    Add Variant
                </button>
                <button type="button" onClick={onCancel} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition">
                    Cancel
                </button>
            </div>
        </div>
    );
}

// ─── Tab panel helper ──────────────────────────────────────────────────────────

interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function AdminProduct() {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);

    const { id } = useParams();
    const mode = id ? "edit" : "create";

    // createdProductId tracks the ID of a freshly-created product so variants can
    // be submitted even before the URL updates.
    const [createdProductId, setCreatedProductId] = useState<number | null>(null);

    // Effective product ID: prefer URL param, fall back to just-created one
    const effectiveProductId = id ? Number(id) : createdProductId;

    const [hasVariant, setHasVariant] = useState(false);
    const [variantRows, setVariantRows] = useState<VariantRow[]>([]);
    const [showManualForm, setShowManualForm] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const { categories } = useCategories();
    const form = useProductForm();
    const filters = useProductFilters();

    const selectedIds = form.formData.selectedOptionValueIds ?? [];

    const skuContext: SkuContext = {
        categoryName: categories.find((c) => c.id === Number(form.formData.categoryId))?.name ?? "",
        productName: form.formData.name,
    };

    // ── Load product data in edit mode ──────────────────────────────────────────
    useEffect(() => {
        if (mode !== "edit" || !id) return;

        (async () => {
            try {
                const product = await productApi.getProductById(Number(id));

                form.setFormData((prev) => ({
                    ...prev,
                    id: product.id ?? "",
                    name: product.name ?? "",
                    slug: product.slug ?? "",
                    basePrice: product.basePrice ?? "",
                    categoryId: product.categoryId ?? "",
                    shortDescription: product.shortDescription ?? "",
                    description: product.description ?? "",
                    thumbnailUrl: product.thumbnailUrl ?? "",
                    selectedOptionValueIds: [],
                }));

                setHasVariant(product.hasVariants);
                console.log(product.hasVariants)

                if (product.categoryId) {
                    const loadedFilters = await filters.loadFilters(Number(product.categoryId));

                    const valueMap = new Map<string, number>();
                    loadedFilters.forEach((opt: any) =>
                        opt.optionValues.forEach((v: any) => valueMap.set(v.value, v.id))
                    );

                    const preSelectedIds: number[] = [];
                    (product.options ?? []).forEach((opt: any) => {
                        (opt.optionValues ?? []).forEach((ov: any) => {
                            const fid = ov.id ?? valueMap.get(ov.value);
                            if (fid !== undefined) preSelectedIds.push(fid);
                        });
                    });

                    form.setFormData((prev) => ({
                        ...prev,
                        selectedOptionValueIds: preSelectedIds,
                    }));
                }
            } catch {
                toast.error("Failed to load product");
            }
        })();
    }, [id]);

    // ── Validation ───────────────────────────────────────────────────────────────
    const validate = (): boolean => {
        if (!form.formData.name.trim()) { toast.error("Product name is required"); return false; }
        if (!form.formData.slug.trim()) { toast.error("Product slug is required"); return false; }
        if (Number(form.formData.basePrice) <= 0) { toast.error("Price must be greater than 0"); return false; }
        if (!form.formData.categoryId) { toast.error("Category is required"); return false; }
        return true;
    };

    // ── Build variant payloads ───────────────────────────────────────────────────
    const buildVariantPayloads = (pid: number): ProductVariantPayload[] =>
        variantRows.map((row) => ({
            variantName: row.variantName.trim() || row.label,
            sku: row.sku.trim(),
            price: Number(row.price),
            originalPrice: Number(row.originalPrice) || Number(row.price),
            stock: Number(row.stock),
            productId: pid,
            imageUrl: row.imageUrls[0]?.url ?? "",

            imageUrls: row.imageUrls.map((img, i) => ({
                imageUrl: img.url,
                displayOrder: img.displayOrder ?? i,
                isMain: i === 0,
                productId: Number(pid),
                variantId: Number(row.serverId)
            })),

            optionValueIds: row.optionValueIds,
        }));

    // ── Save product (tab 1 button) ──────────────────────────────────────────────
    const onSubmittingProduct = async () => {
        if (!validate()) return;

        setSubmitting(true);
        try {
            const payload: ProductPayload = {
                name: form.formData.name.trim(),
                slug: form.formData.slug.trim(),
                shortDescription: form.formData.shortDescription?.trim() ?? "",
                description: form.formData.description?.trim() ?? "",
                basePrice: parseFloat(String(form.formData.basePrice)),
                thumbnailUrl: form.formData.thumbnailUrl ?? "",
                categoryId: Number(form.formData.categoryId),
                selectedOptionValueIds: form.formData.selectedOptionValueIds,
                hasVariants: hasVariant,
            };

            if (mode === "edit" && id) {
                await adminProductsApi.updateProductById(id, payload);
                toast.success("Product updated!");
            } else {
                await adminProductsApi.createProduct(payload);

                const newProduct = await productApi.getProductBySlug(payload.slug!);
                const newId: number = newProduct.id;

                setCreatedProductId(newId);
                toast.success("Product created! You can now add variants.");

                // Navigate to the edit URL so the id param is populated going forward
                navigate(`/admin/products/${newId}/edit`, { replace: true });
            }
        } catch {
            toast.error("Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Save variants (tab 2 button, create mode) ────────────────────────────────
    const onSubmittingVariants = async () => {
        const pid = effectiveProductId;
        if (!pid) {
            toast.error("Please save the product first before adding variants.");
            return;
        }

        if (variantRows.length === 0) {
            toast.error("Add at least one variant before saving.");
            return;
        }

        // Basic variant validation
        for (const row of variantRows) {
            if (!row.sku.trim()) { toast.error(`SKU is required for variant "${row.label}"`); return; }
            if (Number(row.price) <= 0) { toast.error(`Sale price must be > 0 for variant "${row.label}"`); return; }
            if (Number(row.stock) < 0) { toast.error(`Stock cannot be negative for variant "${row.label}"`); return; }
        }

        setSubmitting(true);
        try {
            const variants = buildVariantPayloads(pid);
            await adminProductsApi.createVariants(pid, variants);
            toast.success("Variants created!");
            navigate("/admin/products");
        } catch {
            toast.error("Failed to save variants");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Add manually-entered variant row to the list ─────────────────────────────
    const handleAddManualVariant = (row: VariantRow) => {
        setVariantRows((prev) => [...prev, row]);
        setShowManualForm(false);
        toast.success(`Variant "${row.label}" added`);
    };

    // ── Tab visibility ────────────────────────────────────────────────────────────
    const showAttributesTab = !!form.formData.categoryId && filters.filters.length > 0;
    const showVariantsTab = hasVariant;

    // Map logical tab index to MUI tab index (attributes tab may be hidden)
    // Tab 0: Product, Tab 1 (if visible): Attributes, Tab 2 (if visible): Variants
    const attributesTabIndex = 1;
    const variantsTabIndex = showAttributesTab ? 2 : 1;

    return (
        <div className="w-full overflow-y-auto">
            <Box sx={{ width: "100%" }}>
                <Tabs value={tabIndex} onChange={(_, nv) => setTabIndex(nv)}>
                    <Tab label="Product" />
                    {showAttributesTab && <Tab label="Attributes" />}
                    {showVariantsTab && <Tab label="Variants" />}
                </Tabs>

                {/* ── TAB 0: Product basic info ── */}
                <TabPanel value={tabIndex} index={0}>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-black">
                            {mode === "edit" ? "Edit Product" : "Add New Product"}
                        </h2>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-bold text-black mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={form.formData.name}
                                    onChange={(e) => form.autoGenerateSlug(e.target.value)}
                                    placeholder="Enter product name"
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${form.formErrors.name ? "border-red-500" : "border-black"}`}
                                />
                                {form.formErrors.name && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={16} /> {form.formErrors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block font-bold text-black mb-2">Product Slug (Auto-generated)</label>
                                <input
                                    type="text"
                                    value={form.formData.slug}
                                    placeholder="product-slug"
                                    disabled
                                    readOnly
                                    className={`w-full px-4 py-2 border-2 rounded-lg outline-none cursor-not-allowed bg-gray-200 text-gray-600 ${form.formErrors.slug ? "border-red-500" : "border-black"}`}
                                />
                            </div>
                        </div>

                        {/* Price, Category, Thumbnail */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                            <div className="lg:col-span-1">
                                <label className="block font-bold text-black mb-2">Price (VND)</label>
                                <input
                                    type="number"
                                    value={form.formData.basePrice}
                                    onChange={(e) => form.updateField("basePrice", e.target.value)}
                                    placeholder="Enter product price"
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${form.formErrors.price ? "border-red-500" : "border-black"}`}
                                />
                                {form.formErrors.price && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={16} /> {form.formErrors.price}
                                    </p>
                                )}
                            </div>

                            <div className="lg:col-span-1">
                                <label className="block font-bold text-black mb-2">Category</label>
                                <select
                                    value={form.formData.categoryId}
                                    onChange={(e) => {
                                        const categoryId = parseInt(e.target.value) || 0;
                                        form.updateField("categoryId", categoryId);
                                        form.updateField("selectedOptionValueIds", []);
                                        filters.loadFilters(categoryId);
                                    }}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${form.formErrors.categoryId ? "border-red-500" : "border-black"}`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {form.formErrors.categoryId && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={16} /> {form.formErrors.categoryId}
                                    </p>
                                )}
                            </div>

                            <div className="lg:col-span-2">
                                <div className="flex flex-col md:flex-row items-center gap-4 p-3 border-2 border-black rounded-lg bg-gray-50">
                                    <div className="relative w-20 h-20 shrink-0 bg-white border-2 border-black rounded-md overflow-hidden">
                                        <img src={form.formData.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Thumbnail URL</label>
                                        <input
                                            type="text"
                                            value={form.formData.thumbnailUrl}
                                            onChange={(e) => form.updateField("thumbnailUrl", e.target.value)}
                                            placeholder="https://image-link.com/photo.jpg"
                                            className="w-full px-3 py-2 border-2 border-black rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Descriptions */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block font-bold text-black mb-2">Short Description</label>
                                <textarea
                                    value={form.formData.shortDescription}
                                    onChange={(e) => form.updateField("shortDescription", e.target.value)}
                                    placeholder="Brief product description"
                                    className="w-full h-60 px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-black mb-2">Full Description</label>
                                <textarea
                                    value={form.formData.description}
                                    onChange={(e) => form.updateField("description", e.target.value)}
                                    placeholder="Detailed product description"
                                    className="w-full h-60 px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setTabIndex(1)}
                                disabled={submitting}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="flex flex-row gap-4">Configure Attributes<MoveRight/></span>
                            </button>
                        </div>
                    </div>
                </TabPanel>

                {/* ── TAB 1: Attributes ── */}
                {showAttributesTab && (
                    <TabPanel value={tabIndex} index={attributesTabIndex}>
                        <div className="space-y-4">
                            <label className="block font-bold text-black mb-2">Product Attributes (Options)</label>

                            {filters.filtersLoading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                                    <p className="text-gray-500 text-sm mt-2">Loading attributes...</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filters.filters.map((option) => (
                                        <div key={option.optionId} className="border-2 border-black rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-black mb-3">{option.optionName}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {option.optionValues?.map((value) => (
                                                    <label
                                                        key={value.id}
                                                        className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition"
                                                        style={{
                                                            borderColor: selectedIds.includes(value.id) ? "blue" : "black",
                                                            backgroundColor: selectedIds.includes(value.id) ? "#eff6ff" : "white",
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(value.id)}
                                                            onChange={() => form.handleOptionChange(value.id)}
                                                            className="w-4 h-4 cursor-pointer"
                                                        />
                                                        <span className="text-sm font-medium text-black">{value.value}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ToggleSwitch
                                label="Has Variants?"
                                checked={hasVariant}
                                onChange={(val) => setHasVariant(val)}
                            />

                            <div className="flex justify-end">
                                <button
                                    onClick={onSubmittingProduct}
                                    disabled={submitting}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Saving..." : mode === "edit" ? "Update Product" : "Create Product"}
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                )}

                {/* ── TAB 2: Variants ── */}
                {showVariantsTab && (
                    <TabPanel value={tabIndex} index={variantsTabIndex}>
                        <div className="space-y-4">

                            {/* Info banner when product not yet saved */}
                            {!effectiveProductId && (
                                <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-800">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">Product not saved yet</p>
                                        <p className="text-xs mt-0.5">Go to the <strong>Product</strong> tab and click <strong>Create Product</strong> first. Then come back here to add variants.</p>
                                    </div>
                                </div>
                            )}

                            {/* Variant rows (auto-generated from option values) */}
                            {effectiveProductId && (
                                <ProductVariantsSection
                                    productId={effectiveProductId}
                                    filters={filters.filters}
                                    selectedOptionValueIds={selectedIds}
                                    mode={mode}
                                    onChange={setVariantRows}
                                    initialRows={variantRows}
                                    skuContext={skuContext}
                                />
                            )}

                            {/* Manual add button + form */}
                            {effectiveProductId && (
                                <>
                                    {!showManualForm ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowManualForm(true)}
                                            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-400 text-blue-600 rounded-xl hover:bg-blue-50 transition text-sm font-semibold w-full justify-center"
                                        >
                                            <Plus size={16} />
                                            Add Variant Manually
                                        </button>
                                    ) : (
                                        <ManualVariantForm
                                            filters={filters.filters}
                                            onAdd={handleAddManualVariant}
                                            onCancel={() => setShowManualForm(false)}
                                        />
                                    )}
                                </>
                            )}

                            {/* Submit button */}
                            {effectiveProductId && (
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/admin/products")}
                                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                                    >
                                        Done / Skip
                                    </button>
                                    <button
                                        onClick={onSubmittingVariants}
                                        disabled={submitting || variantRows.length === 0}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        {submitting ? "Saving..." : `Save ${variantRows.length} Variant${variantRows.length !== 1 ? "s" : ""}`}
                                    </button>
                                </div>
                            )}
                        </div>
                    </TabPanel>
                )}
            </Box>
        </div>
    );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Tabs, Tab, Box } from "@mui/material";

import { useCategories } from "../../../hooks/products/useCategories";
import { useProductForm } from "../../../hooks/admin/useProductForm";
import { useProductFilters } from "../../../hooks/products/useProductFilters";

import { adminProductsApi, type ProductPayload, type VariantPayload } from "../../../api/admin/adminProductsApi";
import { productApi } from "../../../api/products/productApi";

import ToggleSwitch from "../../../components/ToggleSwitch";
import ProductVariantsSection, { type VariantRow, type SkuContext, } from "../../../components/Admin/Products/ProductVariantsSection";

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

export default function AdminProduct() {
    const navigate = useNavigate();
    const [value, setValue] = useState(0);

    const { id } = useParams();
    const mode = id ? "edit" : "create";

    const [hasVariant, setHasVariant] = useState(false);
    const [variantRows, setVariantRows] = useState<VariantRow[]>([]);

    const [submitting, setSubmitting] = useState<boolean>(false);

    const { categories } = useCategories();

    const form = useProductForm();
    const filters = useProductFilters();

    const selectedIds = form.formData.selectedOptionValueIds ?? [];

    const skuContext: SkuContext = {
        categoryName:
            categories.find((c) => c.id === Number(form.formData.categoryId))?.name ?? "",
        productName: form.formData.name,
    };

    useEffect(() => {
        if (mode === "create") return;
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
                    images: product.images?.length
                        ? product.images
                        : product.imageUrl
                            ? [product.imageUrl]
                            : [],
                    selectedOptionValueIds: [],
                }));

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
                        id: product.id ?? "",
                        name: product.name ?? "",
                        slug: product.slug ?? "",
                        basePrice: product.basePrice ?? "",
                        categoryId: product.categoryId ?? "",
                        shortDescription: product.shortDescription ?? "",
                        description: product.description ?? "",
                        thumbnailUrl: product.thumbnailUrl ?? "",
                        images: product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [],
                        hasVariants: product.hasVariants ?? false,
                        selectedOptionValueIds: preSelectedIds,
                    }));
                    setHasVariant(product.hasVariants ?? false);
                }

                // Check if product has variants
                if (product.hasVariants) {
                    setHasVariant(true);
                }
            } catch {
                toast.error("Failed to load product");
            }
        })();
    }, [id]);

    // ── Validation ────────────────────────────────────────────────────────────
    const validate = (): boolean => {
        if (!form.formData.name.trim()) {
            toast.error("Product name is required");
            return false;
        }
        if (!form.formData.slug.trim()) {
            toast.error("Product slug is required");
            return false;
        }
        if (Number(form.formData.basePrice) <= 0) {
            toast.error("Price must be greater than 0");
            return false;
        }
        if (!form.formData.categoryId) {
            toast.error("Category is required");
            return false;
        }
        if (hasVariant) {
            for (const row of variantRows) {
                if (!row.sku.trim()) {
                    toast.error(`SKU is required for variant "${row.label}"`);
                    return false;
                }
                if (Number(row.price) <= 0) {
                    toast.error(`Sale price must be > 0 for variant "${row.label}"`);
                    return false;
                }
                if (Number(row.stock) < 0) {
                    toast.error(`Stock cannot be negative for variant "${row.label}"`);
                    return false;
                }
            }
        }
        return true;
    };

    // ── Build variant payload from VariantRow[] ───────────────────────────────
    const buildVariantPayloads = (): VariantPayload[] =>
        variantRows.map((row) => ({
            variantName: row.variantName.trim() || row.label,
            sku: row.sku.trim(),
            price: Number(row.price),
            originalPrice: Number(row.originalPrice) || Number(row.price),
            stock: Number(row.stock),
            optionValueIds: row.optionValueIds,
            imageUrls: row.imageUrls.map((img) => ({
                imageUrl: img.url,
                displayOrder: img.displayOrder,
                isMain: img.displayOrder === 0,
            })),
        }));

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
            // console.log(payload);
            if (mode === "edit" && id) {
                await adminProductsApi.updateProductById(id, payload);
                toast.success("Product updated!");
            } else {
                await adminProductsApi.createProduct(payload);
                toast.success("Product created!");
            }

            navigate("/admin/products");
        } catch {
            toast.error("Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    const onSubmittingVariants = async () => {
        if (!validate()) return;

        setSubmitting(true);
        try {
            const variants = buildVariantPayloads();

            await adminProductsApi.createVariants(id, variants);
            toast.success("Product created!");

            navigate("/admin/products");
        } catch {
            toast.error("Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full p-6 overflow-y-auto">
            <Box sx={{ width: "100%" }}>
                <Tabs value={value} onChange={(e, nv) => setValue(nv)}>
                    <Tab className="font-bold" label="General" />
                    {form.formData.categoryId && filters.filters.length > 0 && <Tab className="font-bold" label="Product Attributes (Options)" />}
                    {hasVariant && <Tab className="font-bold" label="Variants" />}
                </Tabs>

                <TabPanel value={value} index={0}>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-black">
                            {mode === "edit" ? 'Edit Product' : 'Add New Product'}
                        </h2>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-bold text-black mb-2">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={form.formData.name}
                                    onChange={(e) => form.autoGenerateSlug(e.target.value)}
                                    placeholder="Enter product name"
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${form.formErrors.name ? 'border-red-500' : 'border-black'}`}
                                />
                                {form.formErrors.name && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={16} /> {form.formErrors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block font-bold text-black mb-2">
                                    Product Slug (Auto-generated)
                                </label>
                                <input
                                    type="text"
                                    value={form.formData.slug}
                                    placeholder="product-slug"
                                    disabled={true}
                                    readOnly={true}
                                    className={`w-full px-4 py-2 border-2 rounded-lg outline-none cursor-not-allowed bg-gray-200 text-gray-600 ${form.formErrors.slug ? 'border-red-500' : 'border-black'}`}
                                />
                                {form.formErrors.slug && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={16} /> {form.formErrors.slug}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Price and Category */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                            <div className="lg:col-span-1">
                                <label className="block font-bold text-black mb-2">Price (VND)</label>
                                <input
                                    type="number"
                                    value={form.formData.basePrice}
                                    onChange={(e) => form.updateField('basePrice', e.target.value)}
                                    placeholder="Enter product price"
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${form.formErrors.price ? 'border-red-500' : 'border-black'}`}
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
                                        form.updateField('categoryId', categoryId);
                                        form.updateField("selectedOptionValueIds", []);
                                        filters.loadFilters(categoryId);
                                    }}
                                    className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${form.formErrors.categoryId ? 'border-red-500' : 'border-black'}`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id} data-id={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {form.formErrors.categoryId && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={16} /> {form.formErrors.categoryId}
                                    </p>
                                )}
                            </div>

                            {/* Product Images - Enhanced */}
                            <div className="lg:col-span-2">
                                <div className="flex flex-col md:flex-row items-center gap-4 p-3 border-2 border-black rounded-lg bg-gray-50">
                                    {/* Small Preview Box */}
                                    <div className="relative w-20 h-20 shrink-0 bg-white border-2 border-black rounded-md overflow-hidden">
                                        <img
                                            src={form.formData.thumbnailUrl}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* URL Input */}
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                            Thumbnail URL
                                        </label>
                                        <input
                                            type="text"
                                            value={form.formData.thumbnailUrl}
                                            onChange={(e) => form.updateField("thumbnailUrl", e.target.value)}
                                            placeholder="https://image-link.com/photo.jpg"
                                            className="w-full px-3 py-2 border-2 border-black rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        {form.formErrors.imageUrl && (
                                            <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1 uppercase font-bold">
                                                <AlertCircle size={12} /> {form.formErrors.imageUrl}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Descriptions */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block font-bold text-black mb-2">
                                    Short Description
                                </label>
                                <textarea
                                    value={form.formData.shortDescription}
                                    onChange={(e) => form.updateField('shortDescription', e.target.value)}
                                    placeholder="Brief product description"
                                    className={`w-full h-60 px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-black mb-2">
                                    Full Description
                                </label>
                                <textarea
                                    value={form.formData.description}
                                    onChange={(e) => form.updateField('description', e.target.value)}
                                    placeholder="Detailed product description"
                                    className={`w-full h-60 px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
                                />
                            </div>
                        </div>
                    </div>
                </TabPanel>

                {/* Category Filters/Options */}
                {form.formData.categoryId && filters.filters.length > 0 && (
                    <TabPanel value={value} index={1}>
                        <div>
                            <label className="block font-bold text-black mb-2">
                                Product Attributes (Options)
                            </label>

                            {/* Loading state for filters */}
                            {filters.filtersLoading && (
                                <div className="text-center py-4">
                                    <div className="inline-block">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">Loading attributes...</p>
                                </div>
                            )}

                            {!filters.filtersLoading && (
                                <div className="space-y-2">
                                    {filters.filters.map(option => (
                                        <div key={option.optionId} className="border-2 border-black rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-black mb-3">{option.optionName}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {option.optionValues?.map(value => (
                                                    <label
                                                        key={value.id}
                                                        className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition"
                                                        style={{
                                                            borderColor: selectedIds.includes(value.id) ? 'blue' : 'black',
                                                            backgroundColor: selectedIds.includes(value.id) ? '#eff6ff' : 'white',
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(value.id)}
                                                            onChange={() => form.handleOptionChange(value.id)}
                                                            className="w-4 h-4 cursor-pointer"
                                                        />
                                                        <span className="text-sm font-medium text-black border-black">{value.value}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <ToggleSwitch
                            label="Has Variant?"
                            checked={hasVariant}
                            onChange={(value) => {
                                setHasVariant(value);
                            }}
                        />

                        {/* Create New Product Buttons */}
                        <div className="flex justify-end">
                            <button
                                onClick={onSubmittingProduct}
                                disabled={submitting}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </TabPanel>
                )}

                {hasVariant && (
                    <TabPanel value={value} index={2}>
                        <div className="space-y-6">
                            {/* ── Variants section ──────────────────────────────────────── */}
                            {(mode === "edit" && id || form.formData.categoryId) && (
                                <ProductVariantsSection
                                    productId={id}
                                    filters={filters.filters}
                                    selectedOptionValueIds={selectedIds}
                                    mode={mode}
                                    onChange={setVariantRows}
                                    skuContext={skuContext}
                                />
                            )}
                            {mode === "create" && !form.formData.categoryId && (
                                <p className="text-sm text-gray-400 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                                    Save the product first (or select a category) to add variants.
                                </p>
                            )}

                            {/* Create New Product Buttons */}
                            {mode === "create" && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={onSubmittingVariants}
                                        disabled={submitting}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Saving...' : 'Create Product'}
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
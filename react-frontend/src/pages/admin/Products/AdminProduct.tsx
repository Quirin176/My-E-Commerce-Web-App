import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { useCategories } from "../../../hooks/products/useCategories";
import { useProductForm } from "../../../hooks/admin/useProductForm";
import { useProductFilters } from "../../../hooks/products/useProductFilters";
import { useProductVariants } from "../../../hooks/admin/useProductVariants";

import { adminProductsApi } from "../../../api/admin/adminProductsApi";
import { productApi } from "../../../api/products/productApi";

import ProductVariantsSection from "../../../components/Admin/Products/ProductVariantsSection";

export default function AdminProduct() {
    const Navigation = useNavigate();

    const { id } = useParams();
    const mode = id ? "edit" : "create";

    const [submitting, setSubmitting] = useState<boolean>(false);

    const { categories } = useCategories();

    const form = useProductForm();
    const filters = useProductFilters();
    const variants = useProductVariants(id ? Number(id) : null);

    const allImages = Array.isArray(form.formData.images) ? form.formData.images : [];
    const selectedIds = form.formData.selectedOptionValueIds ?? [];

    useEffect(() => {
        if (mode === "create") return;
        (async () => {
            try {
                const product = await productApi.getProductById(Number(id));

                // Populate every form field explicitly
                form.setFormData(prev => ({
                    ...prev,
                    id: product.id ?? "",
                    name: product.name ?? "",
                    slug: product.slug ?? "",
                    price: product.price ?? "",
                    categoryId: product.categoryId ?? "",
                    shortDescription: product.shortDescription ?? "",
                    description: product.description ?? "",
                    imageUrl: "",
                    images: product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [],
                    selectedOptionValueIds: [],
                }));

                // Load filters for the category, then map selected option-value IDs
                if (product.categoryId) {
                    const loadedFilters = await filters.loadFilters(Number(product.categoryId));

                    // Build a value-string → filter-id map so we can pre-tick checkboxes
                    const valueMap = new Map<string, number>();
                    loadedFilters.forEach(opt =>
                        opt.optionValues.forEach(v => valueMap.set(v.value, v.id))
                    );

                    const selectedIds: number[] = [];
                    (product.options ?? []).forEach((opt: any) => {
                        if (!("optionValues" in opt)) return;
                        opt.optionValues.forEach((ov: { value: string }) => {
                            const fid = valueMap.get(ov.value);
                            if (fid !== undefined) selectedIds.push(fid);
                        });
                    });

                    form.setFormData(prev => ({ ...prev, selectedOptionValueIds: selectedIds }));
                }

                // Load variants
                variants.fetchVariants(Number(id));
            } catch {
                toast.error("Failed to load product");
            }
        })();
    }, [id]);

    const onSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                name: form.formData.name.trim(),
                slug: form.formData.slug.trim(),
                shortDescription: form.formData.shortDescription.trim(),
                description: form.formData.description.trim(),
                price: parseFloat(String(form.formData.price)),
                imageUrl: form.formData.images[0] ?? "",
                imageUrls: form.formData.images,
                categoryId: Number(form.formData.categoryId),
                selectedOptionValueIds: form.formData.selectedOptionValueIds,
            };

            if (mode === "edit" && id) {
                await adminProductsApi.updateProductById(id, payload);
            } else {
                await adminProductsApi.createProduct(payload);
            }

            Navigation("/admin/products");
        } catch (err) {
            toast.error("Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w- full p-6 space-y-6 overflow-y-auto">

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
            <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-2 w-full">
                    <label className="font-bold text-black whitespace-nowrap">
                        Price (VND)
                    </label>
                    <input
                        type="number"
                        value={form.formData.price}
                        onChange={(e) => form.updateField('price', e.target.value)}
                        placeholder="Enter product price"
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${form.formErrors.price ? 'border-red-500' : 'border-black'}`}
                    />
                    {form.formErrors.price && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={16} /> {form.formErrors.price}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full">
                    <label className="font-bold text-black whitespace-nowrap">
                        Category
                    </label>

                    <select
                        value={form.formData.categoryId}
                        onChange={(e) => {
                            const categoryId = parseInt(e.target.value) || 0;
                            form.updateField('categoryId', categoryId);
                            form.updateField("selectedOptionValueIds", []);
                            filters.loadFilters(categoryId);
                            console.log(categoryId);
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
            </div>

            {/* Descriptions */}
            <div>
                <label className="block font-bold text-black mb-2">
                    Short Description
                </label>
                <textarea
                    value={form.formData.shortDescription}
                    onChange={(e) => form.updateField('shortDescription', e.target.value)}
                    placeholder="Brief product description"
                    className={`w-full h-40 px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
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

            {/* Product Images - Enhanced */}
            <div>
                <label className="block font-bold text-black mb-2">
                    Product Images
                </label>

                {/* Image URL Input */}
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={form.formData.imageUrl}
                        onChange={(e) => form.updateField("imageUrl", e.target.value)}
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
            </div>

            {/* Category Filters/Options - FIXED with safe access */}
            {form.formData.categoryId && filters.filters.length > 0 && (
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
            )}

            {/* ── Variants section ──────────────────────────────────────── */}
            {(mode === "edit" || form.formData.categoryId) && (
                <ProductVariantsSection
                    variants={variants.variants}
                    filters={filters.filters}
                    isViewMode={false}
                    productId={id ? Number(id) : null}
                    onSave={variants.saveVariant}
                    onDelete={variants.deleteVariant}
                />
            )}
            {mode === "create" && !form.formData.categoryId && (
                <p className="text-sm text-gray-400 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                    Save the product first (or select a category) to add variants.
                </p>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end">
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Saving...' : mode === 'edit' ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </div>
    );
}
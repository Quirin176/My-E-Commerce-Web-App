import { AlertCircle, MoveRight } from "lucide-react";
import type { UseProductFormReturn } from "../../../hooks/admin/product/useProductForm";
import type { UserProductFiltersReturn } from "../../../hooks/products/useProductFilters";
import type { Category } from "../../../types/models/products/Category";

interface ProductInfoTabProps {
    mode: string;
    form: UseProductFormReturn;
    filters: UserProductFiltersReturn;
    categories: Category[];
    submitting: boolean;
    onSubmit: () => void;
    onCategoryChange: (categoryId: number) => void;
}

export default function ProductInfoTab({
    mode,
    form,
    filters,
    categories,
    submitting,
    onSubmit,
    onCategoryChange,
}: ProductInfoTabProps) {
    return (
        <div className="space-y-4">

            <h2 className="text-2xl font-bold">
                {mode === "edit" ? "Edit Product" : "Add New Product"}
            </h2>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-bold mb-2">Product Name</label>
                    <input
                        type="text"
                        value={form.formData.name}
                        onChange={(e) => form.autoGenerateSlug(e.target.value)}
                        placeholder="Enter product name"
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-(--brand-primary) outline-none
                            ${form.formErrors.name ? "border-red-500" : "border-(--border)"}`}
                    />
                    {form.formErrors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={16} /> {form.formErrors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block font-bold mb-2">
                        Product Slug (Auto-generated)
                    </label>
                    <input
                        type="text"
                        value={form.formData.slug}
                        placeholder="product-slug"
                        disabled
                        readOnly
                        className={`w-full px-4 py-2 border-2 rounded-lg outline-none cursor-not-allowed text-(--text-primary) bg-(--bg-muted)
                            ${form.formErrors.slug ? "border-red-500" : "border-(--border)"}`}
                    />
                </div>
            </div>

            {/* Price, Category, Thumbnail */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                <div className="lg:col-span-1">
                    <label className="block font-bold mb-2">Price (VND)</label>
                    <input
                        type="number"
                        value={form.formData.basePrice}
                        onChange={(e) => form.updateField("basePrice", e.target.value)}
                        placeholder="Enter product price"
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-(--brand-primary) outline-none
                            ${form.formErrors.price ? "border-red-500" : "border-(--border)"}`}
                    />
                    {form.formErrors.price && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={16} /> {form.formErrors.price}
                        </p>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <label className="block font-bold mb-2">Category</label>
                    <select
                        value={form.formData.categoryId}
                        onChange={(e) => {
                            const categoryId = parseInt(e.target.value) || 0;
                            form.updateField("categoryId", categoryId);
                            form.updateField("selectedOptionValueIds", []);
                            filters.loadFilters(categoryId);
                            onCategoryChange(categoryId);
                        }}
                        className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-(--brand-primary) outline-none
                            ${form.formErrors.categoryId ? "border-red-500" : "border-(--border)"}`}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} className="bg-(--bg-muted)" value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {form.formErrors.categoryId && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle size={16} /> {form.formErrors.categoryId}
                        </p>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <div className="flex flex-col md:flex-row items-center gap-4 p-3 border-2 border-(--border) rounded-lg">
                        <div className="relative w-20 h-20 shrink-0 border-2 border-(--border) rounded-md overflow-hidden">
                            {form.formData.thumbnailUrl && (
                                <img
                                    src={form.formData.thumbnailUrl}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            )}
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-bold uppercase mb-1">
                                Thumbnail URL
                            </label>
                            <input
                                type="text"
                                value={form.formData.thumbnailUrl}
                                onChange={(e) => form.updateField("thumbnailUrl", e.target.value)}
                                placeholder="https://image-link.com/photo.jpg"
                                className="w-full px-3 py-2 border-2 border-(--border) rounded-md text-sm focus:ring-2 focus:ring-(--brand-primary) outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block font-bold mb-2">Short Description</label>
                    <textarea
                        value={form.formData.shortDescription}
                        onChange={(e) => form.updateField("shortDescription", e.target.value)}
                        placeholder="Brief product description"
                        className="w-full h-60 px-4 py-2 border-2 border-(--border) rounded-lg focus:ring-2 focus:ring-(--brand-primary) outline-none"
                    />
                </div>
                <div>
                    <label className="block font-bold mb-2">Full Description</label>
                    <textarea
                        value={form.formData.description}
                        onChange={(e) => form.updateField("description", e.target.value)}
                        placeholder="Detailed product description"
                        className="w-full h-60 px-4 py-2 border-2 border-(--border) rounded-lg focus:ring-2 focus:ring-(--brand-primary) outline-none"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className="px-6 py-3 bg-(--brand-primary) text-white hover:brightness-75 rounded-lg font-semibold
                    transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="flex flex-row gap-4">
                        {submitting ? "Saving..." : "Configure Attributes"}
                        {!submitting && <MoveRight />}
                    </span>
                </button>
            </div>
        </div>
    );
}
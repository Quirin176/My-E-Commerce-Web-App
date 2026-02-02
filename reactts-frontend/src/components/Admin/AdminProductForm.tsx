// THIS IS A MODAL COMPONENT FOR ADDING/EDITING/VIEWING PRODUCTS IN THE ADMIN DASHBOARD

import { X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import type { Category } from '../../types/models/products/Category';
import type { ProductFormData } from "../../hooks/admin/useProductForm";
import type { ProductOption } from '../../types/models/products/ProductOption';

interface AdminProductFormProps {
  showForm: boolean;
  editingId: number | null;
  isViewMode: boolean;
  formData: ProductFormData;
  formErrors: Record<string, string>;
  categories: Category[];
  filters: ProductOption[];
  filtersLoading: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  updateField: (field: string, value: unknown) => void;
  addImageUrl: () => void;
  removeImageUrl: (index: number) => void;
  handleOptionChange: (optionValueId: number) => void;
  autoGenerateSlug: (name: string) => void;
  onCategoryChange?: (categoryId: number) => void;
}

export default function AdminProductForm({
  showForm,
  editingId,
  isViewMode,
  formData,
  formErrors,
  categories,
  filters,
  filtersLoading,
  submitting,
  onClose,
  onSubmit,
  updateField,
  addImageUrl,
  removeImageUrl,
  handleOptionChange,
  autoGenerateSlug,
  onCategoryChange,
}: AdminProductFormProps) {
  if (!showForm) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    autoGenerateSlug(newName);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('imageUrl', e.target.value);
  };

  // Get display images - use the images array directly
  const allImages = (formData.images && Array.isArray(formData.images))
    ? formData.images
    : [];

  // Get selected option value IDs
  const selectedIds = formData.selectedOptionValueIds ?? [];

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">

          {/* Modal Header */}
          <div className="sticky bg-white border-b px-6 py-2 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black">
              {isViewMode ? 'Product Information' : editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <button
              onClick={onClose}
              className="text-black hover:bg-gray-300 transition rounded-xl cursor-pointer p-1"
            >
              <X size={32} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-black mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  disabled={isViewMode}
                  placeholder="Enter product name"
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${formErrors.name ? 'border-red-500' : 'border-black'}`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-black mb-2">
                  Product Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  placeholder="product-slug"
                  disabled={true}
                  readOnly={true}
                  className={`w-full px-4 py-2 border-2 rounded-lg outline-none cursor-not-allowed bg-gray-200 text-gray-600 ${formErrors.slug ? 'border-red-500' : 'border-black'}`}
                />
                {formErrors.slug && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.slug}
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
                  value={formData.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  disabled={isViewMode}
                  placeholder="Enter product price"
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${formErrors.price ? 'border-red-500' : 'border-black'}`}
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.price}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 w-full">
                <label className="font-bold text-black whitespace-nowrap">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => {
                    const categoryId = parseInt(e.target.value) || 0;
                    updateField('categoryId', categoryId);
                    // Trigger callback if provided
                    if (onCategoryChange) {
                      onCategoryChange(categoryId);
                    }
                  }}
                  disabled={isViewMode}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${formErrors.categoryId ? 'border-red-500' : 'border-black'}`}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.categoryId}
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
                value={formData.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
                disabled={isViewMode}
                placeholder="Brief product description"
                className={`w-full h-40 px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
              />
            </div>

            <div>
              <label className="block font-bold text-black mb-2">
                Full Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                disabled={isViewMode}
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
              {!isViewMode && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    disabled={isViewMode}
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    disabled={isViewMode}
                    onClick={addImageUrl}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Image
                  </button>
                </div>
              )}

              {formErrors.imageUrl && (
                <p className="text-red-500 text-sm mb-3 flex items-center gap-1">
                  <AlertCircle size={16} /> {formErrors.imageUrl}
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
                        {!isViewMode && (
                        <button
                          type="button"
                          disabled={isViewMode}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeImageUrl(idx);
                          }}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-110 z-10"
                          title={`Remove Image ${idx + 1}`}
                        >
                          <Trash2 size={14} />
                        </button>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Filters/Options - FIXED with safe access */}
            {formData.categoryId && filters.length > 0 && (
              <div>
                <label className="block font-bold text-black mb-2">
                  Product Attributes (Options)
                </label>

                {/* Loading state for filters */}
                {filtersLoading && (
                  <div className="text-center py-4">
                    <div className="inline-block">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">Loading attributes...</p>
                  </div>
                )}

                {!filtersLoading && (
                  <div className="space-y-2">
                    {filters.map(option => (
                      <div key={option.optionId} className="border-2 border-black rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-black mb-3">{option.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {option.optionValues?.map(value => (
                            <label
                              key={value.optionValueId}
                              className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition"
                              style={{
                                borderColor: selectedIds.includes(value.optionValueId)
                                  ? 'blue'
                                  : 'black',
                                backgroundColor: selectedIds.includes(value.optionValueId)
                                  ? '#eff6ff'
                                  : 'white',
                              }}
                            >
                              <input
                                type="checkbox"
                                disabled={isViewMode}
                                checked={selectedIds.includes(value.optionValueId)}
                                onChange={() => handleOptionChange(value.optionValueId)}
                                className="w-4 h-4 cursor-pointer"
                              />
                              <span className="text-sm font-medium text-black border-black">
                                {value.value}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit Buttons */}
            {!isViewMode && (
            <div className="flex gap-3 pt-6 border-t">
              <button
                onClick={onSubmit}
                disabled={isViewMode || submitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

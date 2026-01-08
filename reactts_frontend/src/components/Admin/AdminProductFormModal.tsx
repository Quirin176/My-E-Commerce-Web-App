import { X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import type { Category } from '../../types/models/Category';
import type { ProductFormData } from "../../hooks/admin/useProductForm";
import type { ProductOption } from '../../types/models/ProductOption';

interface ProductFormModalProps {
  showForm: boolean;
  editingId: number | null;
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

export default function ProductFormModal({
  showForm,
  editingId,
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
}: ProductFormModalProps) {
  if (!showForm) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    autoGenerateSlug(newName);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('images', e.target.value);
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
          <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingId ? 'Edit Product' : 'Create New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Enter product name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Slug (Auto-generated)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  placeholder="product-slug"
                  disabled={true}
                  readOnly={true}
                  className={`w-full px-4 py-2 border rounded-lg outline-none cursor-not-allowed bg-gray-200 text-gray-600 ${ formErrors.slug ? 'border-red-500' : 'border-gray-300'}`}
                  />
                {formErrors.slug && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.slug}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Auto-generated from product name</p>
              </div>
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price (VND)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    formErrors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.price && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    formErrors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
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
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
                placeholder="Brief product description"
                className="w-full h-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Detailed product description"
                className="w-full h-60 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Product Images - Enhanced */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Images
              </label>
              
              {/* Image URL Input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Image
                </button>
              </div>

              {formErrors.imageUrl && (
                <p className="text-red-500 text-sm mb-3 flex items-center gap-1">
                  <AlertCircle size={16} /> {formErrors.imageUrl}
                </p>
              )}

              {/* Images List */}
              {allImages.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Added Images ({allImages.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {allImages.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`Product ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/96?text=No+Image';
                          }}
                        />
                        {/* Image Number Badge */}
                        <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {idx + 1}
                        </span>
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeImageUrl(idx)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 rounded-lg transition"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Category Filters/Options - FIXED with safe access */}
            {formData.categoryId && filters.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
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
                  <div className="space-y-4">
                    {filters.map(option => (
                      <div key={option.optionId} className="border border-gray-300 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-3">{option.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {option.optionValues?.map(value => (
                            <label
                              key={value.optionValueId}
                              className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition"
                              style={{
                                borderColor: selectedIds.includes(value.optionValueId)
                                  ? '#3b82f6'
                                  : '#d1d5db',
                                backgroundColor: selectedIds.includes(value.optionValueId)
                                  ? '#eff6ff'
                                  : 'white',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(value.optionValueId)}
                                onChange={() => handleOptionChange(value.optionValueId)}
                                className="w-4 h-4 cursor-pointer"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {value.value}
                              </span>
                              {selectedIds.includes(value.optionValueId) && (
                                <span className="ml-auto text-blue-600">✓</span>
                              )}
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
            <div className="flex gap-3 pt-6 border-t">
              <button
                onClick={onSubmit}
                disabled={submitting}
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
          </div>
        </div>
      </div>
    </>
  );
}

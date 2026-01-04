import { X, AlertCircle } from 'lucide-react';
import type { ProductOption } from '../../types/models/ProductOption';

interface ProductFormModalProps {
  showForm: boolean;
  editingId: number | null;
  formData: any;
  formErrors: Record<string, string>;
  categories: any[];
  filters: ProductOption[];
  submitting: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  updateField: (field: string, value: any) => void;
  addImageUrl: () => void;
  removeImageUrl: (index: number) => void;
  handleOptionChange: (optionValueId: string | number) => void;
}

export default function ProductFormModal({
  showForm,
  editingId,
  formData,
  formErrors,
  categories,
  filters,
  submitting,
  onClose,
  onSubmit,
  updateField,
  addImageUrl,
  removeImageUrl,
  handleOptionChange,
}: ProductFormModalProps) {
  if (!showForm) return null;

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
                  onChange={(e) => updateField('name', e.target.value)}
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
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="product-slug"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    formErrors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.slug && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {formErrors.slug}
                  </p>
                )}
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
                  onChange={(e) => updateField('categoryId', e.target.value)}
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
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Images
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => updateField('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Add Image
                </button>
              </div>

              {formErrors.imageUrl && (
                <p className="text-red-500 text-sm mb-3 flex items-center gap-1">
                  <AlertCircle size={16} /> {formErrors.imageUrl}
                </p>
              )}

              {formData.imageUrls.length > 0 && (
                <div className="space-y-2">
                  {formData.imageUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={url}
                          alt={`Product ${idx + 1}`}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
                          }}
                        />
                        <p className="text-sm text-gray-700 truncate">{url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImageUrl(idx)}
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Filters/Options */}
            {formData.categoryId && filters.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Attributes (Options)
                </label>
                <div className="space-y-4">
                  {filters.map(option => (
                    <div key={option.optionId} className="border border-gray-300 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2">{option.name}</h4>
                      <div className="flex flex-wrap gap-6">
                        {option.optionValues?.map(value => (
                          <label
                            key={value.optionValueId}
                            className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedOptionValueIds.includes(value.optionValueId)}
                              onChange={() => handleOptionChange(value.optionValueId)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{value.value}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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

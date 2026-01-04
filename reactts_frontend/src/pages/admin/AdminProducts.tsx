import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ChevronDown, AlertCircle } from 'lucide-react';
import { useAdminProducts } from '../../hooks/admin/useAdminProducts';
import { useCategories } from '../../hooks/useCategories';
import { useProductFilters } from '../../hooks/useProductFilters';
import { useProductForm } from '../../hooks/admin/useProductForm';
import { useProductSearch } from '../../hooks/useProductSearch';
import { useProductModal } from '../../hooks/admin/useProductModal';
import { slugify } from '../../utils/slugify';
import ProductFormModal from '../../components/Admin/AdminProductFormModal';

const AdminProducts = () => {
  // Hooks for data management
  const { products, loading: productsLoading, error: productsError, createProduct, updateProduct, deleteProduct } = useAdminProducts();
  const { categories } = useCategories();
  const { filters, loadFiltersByCategory } = useProductFilters();
  const { 
    formData, 
    formErrors, 
    validateForm, 
    addImageUrl, 
    removeImageUrl, 
    handleCategoryChange, 
    handleOptionChange, 
    updateField,
    resetForm,
    setFormData 
  } = useProductForm();
  const { searchTerm, setSearchTerm, filteredProducts, clearSearch } = useProductSearch(products);
  const { 
    showForm, 
    editingId, 
    expandedProduct, 
    openCreateForm, 
    openEditForm, 
    closeForm, 
    toggleExpandProduct 
  } = useProductModal();

  const [submitting, setSubmitting] = useState(false);

  const handleCategorySelect = (categoryId: number) => {
    handleCategoryChange(categoryId);
    loadFiltersByCategory(categoryId);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrls: formData.imageUrls.length > 0 ? formData.imageUrls : [formData.imageUrl]
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      closeForm();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      slug: slugify(product.name),
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: product.price.toString(),
      imageUrl: product.imageUrl || '',
      imageUrls: product.images || [],
      categoryId: product.categoryId || '',
      selectedOptionValueIds: []
    });
    loadFiltersByCategory(product.categoryId);
    openEditForm(product.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCloseForm = () => {
    resetForm();
    closeForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Products Management</h1>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Error Display */}
        {productsError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {productsError}
          </div>
        )}

        {/* Product Form Modal */}
        <ProductFormModal
          showForm={showForm}
          editingId={editingId}
          formData={formData}
          formErrors={formErrors}
          categories={categories}
          filters={filters}
          submitting={submitting}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          updateField={updateField}
          addImageUrl={addImageUrl}
          removeImageUrl={removeImageUrl}
          handleOptionChange={handleOptionChange}
        />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Products List */}
        {productsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No products match your search' : 'No products found'}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleExpandProduct(product.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <img
                        src={product.imageUrl || 'https://via.placeholder.com/80?text=No+Image'}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.slug}</p>
                        <p className="text-blue-600 font-semibold mt-1">{product.price?.toLocaleString()} VND</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(product);
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                      <ChevronDown
                        size={20}
                        className={`transition ${expandedProduct === product.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {expandedProduct === product.id && (
                  <div className="border-t p-6 bg-gray-50 space-y-4">
                    {product.shortDescription && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Short Description</h4>
                        <p className="text-gray-600">{product.shortDescription}</p>
                      </div>
                    )}
                    {product.description && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-1">Description</h4>
                        <p className="text-gray-600">{product.description}</p>
                      </div>
                    )}
                    {product.options && product.options.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Attributes</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.options.map((opt, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {opt.optionName}: {opt.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.images && product.images.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Gallery</h4>
                        <div className="flex gap-2 overflow-x-auto">
                          {product.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${product.name} ${idx + 1}`}
                              className="w-24 h-24 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/96?text=No+Image';
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

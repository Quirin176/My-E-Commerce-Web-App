import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { filterApi } from "../../api/filterApi";
import { productoptionApi } from "../../api/productoptionApi";
import { Edit2, X, Plus, Trash2 } from "lucide-react";

export default function AdminProductForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    slug: initialData.slug || "",
    categoryId: initialData.categoryId || "",
    price: initialData.price || "",
    imageUrl: initialData.imageUrl || "",
    shortDescription: initialData.shortDescription || "",
    description: initialData.description || "",
  });

  const [imageUrls, setImageUrls] = useState(initialData.Images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Modal states for loading categories and options
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedOptionValues, setSelectedOptionValues] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states for adding new product options
  const [showAddOptionModal, setShowAddOptionModal] = useState(false);
  const [newOptionName, setNewOptionName] = useState("");
  const [addingOption, setAddingOption] = useState(false);

  // Modal states for adding new option values
  const [showAddValueModal, setShowAddValueModal] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [addingValue, setAddingValue] = useState(false);

  // Modal states for editing option values
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOptionValueId, setEditingOptionValueId] = useState(null);
  const [editingOptionId, setEditingOptionId] = useState(null);
  const [editOptionValue, setEditOptionValue] = useState("");
  const [editingValue, setEditingValue] = useState(false);

  // Modal states for deleting option values
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOptionId, setDeletingOptionId] = useState(null);
  const [deletingOptionValueId, setDeletingOptionValueId] = useState(null);
  const [deletingValue, setDeletingValue] = useState(false);

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("http://localhost:5159/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // Load product options when category changes
  useEffect(() => {
    const loadCategoryOptions = async () => {
      if (!form.categoryId) {
        setCategoryOptions([]);
        setSelectedOptionValues([]);
        return;
      }

      try {
        const options = await filterApi.getFiltersByCategoryId(
          parseInt(form.categoryId)
        );
        setCategoryOptions(Array.isArray(options) ? options : []);

        // If editing product, extract selected option value IDs from initialData
        if (initialData.options && initialData.options.length > 0) {
          // console.log("Loading initial options:", initialData.options);

          // Build a map of option values for lookup
          const optionValueMap = {};
          options.forEach((opt) => {
            opt.optionValues.forEach((val) => {
              optionValueMap[`${opt.name}:${val.value}`] = val.optionValueId;
            });
          });

          // Extract option value IDs from product options
          const selectedIds = initialData.options
            .map((opt) => {
              const key = `${opt.optionName}:${opt.value}`;
              return optionValueMap[key];
            })
            .filter((id) => id !== undefined);

          console.log("Selected option value IDs:", selectedIds);
          setSelectedOptionValues(selectedIds);
        } else {
          setSelectedOptionValues([]);
        }
      } catch (error) {
        console.error("Error loading category options:", error);
        toast.error("Failed to load category options");
      }
    };

    loadCategoryOptions();
  }, [form.categoryId, initialData.options]);

  const generateSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add image to list
  const addImage = () => {
    if (!newImageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    if (imageUrls.includes(newImageUrl)) {
      toast.error("This image URL already exists");
      return;
    }

    setImageUrls([...imageUrls, newImageUrl]);
    setNewImageUrl("");
    toast.success("Image added");
  };

  // Remove image from list
  const removeImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  // Add new product option
  const handleAddProductOption = async () => {
    if (!newOptionName.trim()) {
      toast.error("Please enter an option name");
      return;
    }

    if (!form.categoryId) {
      toast.error("Please select a category first");
      return;
    }

    setAddingOption(true);
    try {
      await productoptionApi.createProductOption(parseInt(form.categoryId), newOptionName);
      toast.success("Product option created successfully!");

      // Reload options
      const updatedOptions = await filterApi.getFiltersByCategoryId(parseInt(form.categoryId));
      setCategoryOptions(Array.isArray(updatedOptions) ? updatedOptions : []);

      setShowAddOptionModal(false);
      setNewOptionName("");
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg = error.response?.data?.message || "Failed to create product option";
      toast.error(errorMsg);
    } finally {
      setAddingOption(false);
    }
  };
  
  // Add new option value
  const handleAddOptionValue = async () => {

    if (!selectedOptionId) {
      toast.error("Please select an option");
      return;
    }

    if (!newOptionValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    setAddingValue(true);
    try {
      await productoptionApi.createOptionValue(selectedOptionId, newOptionValue);
      toast.success("Option value added successfully!");

      // Reload options
      const updatedOptions = await filterApi.getFiltersByCategoryId(parseInt(form.categoryId));
      setCategoryOptions(Array.isArray(updatedOptions) ? updatedOptions : []);

      setShowAddValueModal(false);
      setNewOptionValue("");
      setSelectedOptionId(null);
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg =
        error.response?.data?.message || "Failed to add option value";
      toast.error(errorMsg);
    } finally {
      setAddingValue(false);
    }
  };

  // Edit option value
  const handleEditOptionValue = async () => {
    if (!editingOptionValueId) {
      toast.error("Option value not selected");
      return;
    }

    if (!editOptionValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    setEditingValue(true);
    try {
      await filterApi.updateOptionValue(editingOptionValueId, editOptionValue);
      toast.success("Option value updated successfully!");

      // Reload options
      const updatedOptions = await filterApi.getFiltersByCategoryId(
        parseInt(form.categoryId)
      );
      setCategoryOptions(Array.isArray(updatedOptions) ? updatedOptions : []);

      setShowEditModal(false);
      setEditOptionValue("");
      setEditingOptionValueId(null);
      setEditingOptionId(null);
    } catch (error) {
      console.error("Error updating option value:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to update option value";
      toast.error(errorMsg);
    } finally {
      setEditingValue(false);
    }
  };

  const handleDeleteOptionValue = async () => {
    if (!deletingOptionValueId) {
      toast.error("Option value not selected");
      return;
    }

    setDeletingValue(true);
    try {
      await filterApi.deleteOptionValue(deletingOptionValueId);
      toast.success("Option value deleted successfully!");

      const updatedOptions = await filterApi.getFiltersByCategoryId(
        parseInt(form.categoryId)
      );
      setCategoryOptions(Array.isArray(updatedOptions) ? updatedOptions : []);

      setShowDeleteModal(false);
      setDeletingOptionId(null);
      setDeletingOptionValueId(null);
    } catch (error) {
      console.error("Error deleting option value:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to delete option value";
      toast.error(errorMsg);
    } finally {
      setDeletingValue(false);
    }
  };

  // Handle option value selection (checkbox)
  const toggleOptionValue = (optionValueId) => {
    setSelectedOptionValues((prev) =>
      prev.includes(optionValueId)
        ? prev.filter((id) => id !== optionValueId)
        : [...prev, optionValueId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.name.trim()) {
      toast.error("Product Name is required");
      return;
    }

    if (!form.slug || !form.slug.trim()) {
      toast.error("Product Slug cannot be empty");
      return;
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      toast.error("Price must be a valid number greater than 0");
      return;
    }

    if (!form.categoryId) {
      toast.error("Please select a Category");
      return;
    }

    if (imageUrls.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    // Build payload with multiple images
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      categoryId: parseInt(form.categoryId, 10),
      price: parseFloat(form.price),
      imageUrl: imageUrls[0],
      imageUrls: imageUrls,
      shortDescription: form.shortDescription?.trim() || null,
      description: form.description?.trim() || null,
      selectedOptionValueIds: selectedOptionValues,
    };

    setLoading(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 w-full" onSubmit={handleSubmit}>
      <div className="md:grid md:grid-cols-2 md:gap-12 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block mb-1 font-semibold text-red-600">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name (e.g., Dell XPS 13)"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              value={form.name}
              onChange={handleNameChange}
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block mb-1 font-semibold">
              Product Slug (Auto-generated)
            </label>
            <input
              type="text"
              name="slug"
              placeholder="Auto-generated from name"
              className="w-full border border-gray-300 p-2 rounded-lg bg-gray-100 text-gray-600"
              value={form.slug}
              readOnly
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-semibold text-red-600">
              Category *
            </label>
            <select
              name="categoryId"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-semibold text-red-600">
              Price (VND) *
            </label>
            <input
              type="number"
              name="price"
              placeholder="e.g., 25000000"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              value={form.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Multiple Product Images */}
          <div className="border-2 border-dashed border-blue-300 p-4 rounded-lg bg-blue-50">
            <label className="block mb-2 font-semibold text-blue-700">
              Product Images *
            </label>

            {/* Add new image */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addImage()}
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Add Image
              </button>
            </div>

            {/* Display images list */}
            {imageUrls.length > 0 ? (
              <div className="space-y-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 hover:border-gray-300 transition"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/48?text=Invalid";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">
                          {index === 0 && (
                            <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs font-semibold mr-1">
                              Main
                            </span>
                          )}
                          Image {index + 1}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{url}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No images added yet. Add at least one image.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6 pt-4 md:pt-0 flex flex-col justify-between">
          {/* Short Description */}
          <div className="flex-1">
            <label className="block mb-1 font-semibold">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              placeholder="Brief product description (max 1000 characters)"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-32 resize-none"
              value={form.shortDescription}
              onChange={handleChange}
              maxLength="1000"
            />
            <small className="text-gray-500">
              {form.shortDescription.length}/1000
            </small>
          </div>

          {/* Full Description */}
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Full Description</label>
            <textarea
              name="description"
              placeholder="Detailed product description"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-40 resize-none"
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* DYNAMIC PRODUCT OPTIONS (Category-specific) */}
      {categoryOptions.length > 0 && (
        <div className="border-t pt-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              Product Attributes (Select all that apply)
            </h3>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddOptionModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold"
              >
                <Plus size={16} />
                Add New Option
              </button>

              <button
                type="button"
                onClick={() => setShowAddValueModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold"
              >
                <Plus size={16} />
                Add New Value
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {categoryOptions.map((option) => (
              <div
                key={option.optionId}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <h4 className="font-semibold text-gray-800">
                  {option.name}
                  {option.name.toLowerCase() === "brand" && (
                    <span className="text-sm text-blue-600 ml-2">
                      (Select manufacturer)
                    </span>
                  )}
                </h4>
                <div className="flex flex-wrap">
                  {option.optionValues.map((optValue) => (
                    <div
                      key={optValue.optionValueId}
                      className="flex items-center hover:bg-gray-100 rounded transition group"
                    >
                      <label
                        key={optValue.optionValueId}
                        className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded transition"
                      >
                        <input
                          type="checkbox"
                          value={optValue.optionValueId}
                          checked={selectedOptionValues.includes(
                            optValue.optionValueId
                          )}
                          onChange={() =>
                            toggleOptionValue(optValue.optionValueId)
                          }
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-gray-700 text-sm">
                          {optValue.value}
                        </span>
                      </label>

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(true);
                          setEditingOptionId(option.optionId);
                          setEditingOptionValueId(optValue.optionValueId);
                          setEditOptionValue(optValue.value);
                        }}
                        className="ml-1 p-1 text-blue-500 hover:bg-blue-100 rounded opacity-0 group-hover:opacity-100 transition"
                        title="Edit this option value"
                      >
                        <Edit2 size={14} />
                      </button>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setDeletingOptionId(option.optionId);
                          setDeletingOptionValueId(optValue.optionValueId);
                        }}
                        className="ml-2 p-1 text-red-500 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition"
                        title="Delete this option value"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {selectedOptionValues.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <small className="text-gray-600 font-semibold">
                Selected: {selectedOptionValues.length} attribute(s)
              </small>
            </div>
          )}
        </div>
      )}

      {categoryOptions.length === 0 && form.categoryId && (
        <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-sm text-gray-600">
            No attributes available for this category. You can still save the
            product.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded mt-6 hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>

      {/* Modal for adding new product option */}
      {showAddOptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Add New Product Option</h3>

            {/* Enter Option Name */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Option Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Processor, RAM, Storage, Color"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
              />
              <small className="text-gray-500 mt-1 block">
                This will be the attribute name for your category
              </small>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddOptionModal(false);
                  setNewOptionName("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProductOption}
                disabled={addingOption}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition font-semibold"
              >
                {addingOption ? "Creating..." : "Create Option"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding new option value */}
      {showAddValueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Add New Option Value</h3>

            {/* Select Option */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Select Option *
              </label>
              <select
                value={selectedOptionId || ""}
                onChange={(e) =>
                  setSelectedOptionId(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Select an Option --</option>
                {categoryOptions.map((option) => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Enter Value */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Option Value *
              </label>
              <input
                type="text"
                placeholder="e.g., Intel Core i7"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddValueModal(false);
                  setNewOptionValue("");
                  setSelectedOptionId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddOptionValue}
                disabled={addingValue}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-semibold"
              >
                {addingValue ? "Adding..." : "Add Value"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing option value */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-blue-600">
              Edit Option Value
            </h3>

            {/* Enter New Value */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Option Value *
              </label>
              <input
                type="text"
                placeholder="e.g., Intel Core i9"
                value={editOptionValue}
                onChange={(e) => setEditOptionValue(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditOptionValue("");
                  setEditingOptionValueId(null);
                  setEditingOptionId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditOptionValue}
                disabled={editingValue}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
              >
                {editingValue ? "Updating..." : "Update Value"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for deleting option value */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-red-600">
              Delete Option Value?
            </h3>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this option value? This action
              cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingOptionValueId(null);
                  setDeletingOptionId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOptionValue}
                disabled={deletingValue}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-semibold"
              >
                {deletingValue ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

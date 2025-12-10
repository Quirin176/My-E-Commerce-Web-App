import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { filterApi } from "../../api/filterApi";

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

  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedOptionValues, setSelectedOptionValues] = useState([]);
  const [loading, setLoading] = useState(false);

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
        const options = await filterApi.getFiltersByCategoryId(parseInt(form.categoryId));
        setCategoryOptions(Array.isArray(options) ? options : []);
        setSelectedOptionValues([]); // Reset selected options
        console.log(`Loaded options for category ${form.categoryId}:`, options);
      } catch (error) {
        console.error("Error loading category options:", error);
        toast.error("Failed to load category options");
      }
    };

    loadCategoryOptions();
  }, [form.categoryId]);

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

    // Build payload with option values
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      categoryId: parseInt(form.categoryId, 10),
      price: parseFloat(form.price),
      imageUrl: form.imageUrl?.trim() || null,
      shortDescription: form.shortDescription?.trim() || null,
      description: form.description?.trim() || null,
      selectedOptionValueIds: selectedOptionValues,
    };

    // console.log("Submitting product payload:", payload);
    // console.log("Selected attributes:", selectedOptionValues.length, "attributes");

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
            <label className="block mb-1 font-semibold text-red-600">Product Name *</label>
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
            <label className="block mb-1 font-semibold">Product Slug (Auto-generated)</label>
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
            <label className="block mb-1 font-semibold text-red-600">Category *</label>
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
            <label className="block mb-1 font-semibold text-red-600">Price (VND) *</label>
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

          {/* Image URL */}
          <div>
            <label className="block mb-1 font-semibold">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-6 pt-4 md:pt-0 flex flex-col justify-between">
          {/* Short Description */}
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Short Description</label>
            <textarea
              name="shortDescription"
              placeholder="Brief product description (max 1000 characters)"
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none h-32 resize-none"
              value={form.shortDescription}
              onChange={handleChange}
              maxLength="1000"
            />
            <small className="text-gray-500">{form.shortDescription.length}/1000</small>
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
          <h3 className="text-lg font-bold mb-4">Product Attributes (Select all that apply)</h3>
          <div className="space-y-4">
            {categoryOptions.map((option) => (
              <div key={option.optionId} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-3">
                  {option.name}
                  {option.name.toLowerCase() === "brand" && (
                    <span className="text-sm text-blue-600 ml-2">(Select manufacturer)</span>
                  )}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {option.optionValues.map((optValue) => (
                    <label
                      key={optValue.optionValueId}
                      className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded transition"
                    >
                      <input
                        type="checkbox"
                        value={optValue.optionValueId}
                        checked={selectedOptionValues.includes(optValue.optionValueId)}
                        onChange={() => toggleOptionValue(optValue.optionValueId)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-gray-700 text-sm">{optValue.value}</span>
                    </label>
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
          <p className="text-sm text-gray-600">No attributes available for this category. You can still save the product.</p>
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
    </form>
  );
}

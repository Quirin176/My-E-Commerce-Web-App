import { useCallback, useState } from "react";
import { slugify } from "../../utils/slugify";

// Define the structure of the product form data
export interface ProductFormData {
  id: string | number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number | string;
  imageUrl: string;
  images: string[];
  categoryId: number | string;
  selectedOptionValueIds: number[];
}

// Define the return type of the useProductForm hook
interface UseProductFormReturn {
  formData: ProductFormData;
  formErrors: Record<string, string>;
  setFormData: (data: ProductFormData) => void;
  updateField: (field: keyof ProductFormData, value: unknown) => void;
  validateForm: () => boolean;
  addImageUrl: () => void;
  removeImageUrl: (index: number) => void;
  handleOptionChange: (optionValueId: number) => void;
  resetForm: () => void;
  autoGenerateSlug: (name: string) => void;
}

// Initial form data template
const INITIAL_FORM_DATA: ProductFormData = {
  id: "",
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  imageUrl: "",
  images: [],
  categoryId: "",
  selectedOptionValueIds: [],
};

// Custom hook to manage product form state and logic
export const useProductForm = (): UseProductFormReturn => {
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update a specific field in the form data
  const updateField = useCallback((field: keyof ProductFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formErrors]);

  // Auto-generate slug from product name
  const autoGenerateSlug = useCallback((name: string) => {
    const generatedSlug = slugify(name);
    setFormData((prev) => ({
      ...prev,
      name: name,
      slug: generatedSlug,
    }));
  }, []);

  // Validate the form data before submission
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
    if (!formData.slug.trim()) {
      errors.slug = "Product slug is required";
    }
    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = "Valid price is required (must be greater than 0)";
    }
    if (!formData.categoryId || Number(formData.categoryId) <= 0) {
      errors.categoryId = "Category is required";
    }
    if (!formData.images || formData.images.length === 0) {
      errors.images = "At least one image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Add a new image URL to the images array
  const addImageUrl = useCallback(() => {
    const trimmedUrl = formData.imageUrl?.trim();
    
    // Validate the image URL
    if (!trimmedUrl) {
      setFormErrors((prev) => ({
        ...prev,
        imageUrl: "Please enter an image URL",
      }));
      return;
    }
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      setFormErrors((prev) => ({
        ...prev,
        imageUrl: "URL must start with http:// or https://",
      }));
      return;
    }
    if (formData.images.includes(trimmedUrl)) {
      setFormErrors((prev) => ({
        ...prev,
        imageUrl: "This image URL already exists",
      }));
      return;
    }

    // Add the valid image URL to the images array
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmedUrl],
      imageUrl: "",
    }));

    // Clear error
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.imageUrl;
      return newErrors;
    });
  }, [formData.imageUrl, formData.images]);

  // Remove an image URL from the images array by index
  const removeImageUrl = useCallback((index: number) => {
    setFormData((prev) => {
    const newImages = prev.images.filter((_, i) => i !== index);
    return {
      ...prev,
      images: newImages,
    };
  });
}, []);

  // Handle selection/deselection of product option values
  const handleOptionChange = useCallback((optionValueId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedOptionValueIds.includes(optionValueId);
      return {
        ...prev,
        selectedOptionValueIds: isSelected
          ? prev.selectedOptionValueIds.filter((id) => id !== optionValueId)
          : [...prev.selectedOptionValueIds, optionValueId],
      };
    });
  }, []);

  // Reset the form to its initial state
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  }, []);

  return {
    formData,
    formErrors,
    setFormData,
    updateField,
    validateForm,
    addImageUrl,
    removeImageUrl,
    handleOptionChange,
    resetForm,
    autoGenerateSlug,
  };
};

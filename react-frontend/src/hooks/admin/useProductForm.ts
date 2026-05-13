import { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { slugify } from "../../utils/slugify";

// Define the return type of the useProductForm hook
interface UseProductFormReturn {
  formData: ProductFormData;
  formErrors: Record<string, string>;
  setFormData: Dispatch<SetStateAction<ProductFormData>>;
  updateField: (field: keyof ProductFormData, value: unknown) => void;
  validateForm: () => boolean;
  handleOptionChange: (optionValueId: number) => void;
  resetForm: () => void;
  autoGenerateSlug: (name: string) => void;
}

// Define the structure of the product form data
export interface ProductFormData {
  id: string | number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  basePrice: number | string;
  thumbnailUrl: string;
  categoryId: number | string;
  selectedOptionValueIds: number[];
}

// Initial form data template
const INITIAL_FORM_DATA: ProductFormData = {
  id: "",
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  basePrice: "",
  thumbnailUrl: "",
  categoryId: "",
  selectedOptionValueIds: [],
};

// Custom hook to manage product form state and logic
export const useProductForm = (): UseProductFormReturn => {
  const [formData, setFormData]: [ProductFormData, Dispatch<SetStateAction<ProductFormData>>] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update a specific field in the form data
  const updateField = useCallback((field: keyof ProductFormData, value: unknown) => {
    // Update the form data with the new value for the specified field
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
    const priceNum = Number(formData.basePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = "Valid price is required (must be greater than 0)";
    }
    if (!formData.categoryId || Number(formData.categoryId) <= 0) {
      errors.categoryId = "Category is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

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
    handleOptionChange,
    resetForm,
    autoGenerateSlug,
  };
};

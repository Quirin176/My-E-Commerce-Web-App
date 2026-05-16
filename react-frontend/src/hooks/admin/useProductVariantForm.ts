import { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { slugify } from "../../utils/slugify";
import type { VariantImagePayload } from "../../api/admin/adminProductsApi";

// Define the return type of the useProductForm hook
interface UseProductVariantFormReturn {
  formData: ProductVariantFormData;
  formErrors: Record<string, string>;
  setFormData: Dispatch<SetStateAction<ProductVariantFormData>>;
  updateField: (field: keyof ProductVariantFormData, value: unknown) => void;
  validateForm: () => boolean;
  handleOptionChange: (optionValueId: number) => void;
  resetForm: () => void;
  autoGenerateSlug: (name: string) => void;
}

// Define the structure of the product form data
export interface ProductVariantFormData {
  id: string | number;
  variantName: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  productId: number | string;
  imageUrl: string;

  imageUrls: VariantImagePayload[];

  optionValueIds: number[];
}

// Initial form data template
const INITIAL_FORM_DATA: ProductVariantFormData = {
  id: "",
  variantName: "",
  sku: "",
  price: 0,
  originalPrice: 0,
  stock: 0,
  productId: "",
  imageUrl: "",

  imageUrls: [],

  optionValueIds: []
};

// Custom hook to manage product form state and logic
export const useProductForm = (): UseProductVariantFormReturn => {
  const [formData, setFormData]: [ProductVariantFormData, Dispatch<SetStateAction<ProductVariantFormData>>] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Update a specific field in the form data
  const updateField = useCallback((field: keyof ProductVariantFormData, value: unknown) => {
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

    if (!formData.variantName.trim()) {
      errors.name = "Product name is required";
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = "Valid price is required (must be greater than 0)";
    }

    const priceOriginNum = Number(formData.originalPrice);
    if (isNaN(priceOriginNum) || priceOriginNum <= 0) {
      errors.price = "Valid price is required (must be greater than 0)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handle selection/deselection of product option values
  const handleOptionChange = useCallback((optionValueId: number) => {
    setFormData((prev) => {
      const isSelected = prev.optionValueIds.includes(optionValueId); // Check if the option value is already selected
      return {
        ...prev, optionValueIds: isSelected ?
        prev.optionValueIds.filter((id) => id !== optionValueId) : [...prev.optionValueIds, optionValueId],
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
import { useCallback, useState } from "react";
import { slugify } from "../../utils/slugify";

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

const INITIAL_FORM_DATA: ProductFormData = {
  id: "",
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: 0,
  imageUrl: "",
  images: [],
  categoryId: "",
  selectedOptionValueIds: [],
};

export const useProductForm = (): UseProductFormReturn => {
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const autoGenerateSlug = useCallback((name: string) => {
    const generatedSlug = slugify(name);
    setFormData((prev) => ({
      ...prev,
      name: name.trim(),
      slug: generatedSlug,
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }

    // Validate slug
    if (!formData.slug.trim()) {
      errors.slug = "Product slug is required";
    }

    // Validate price
    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = "Valid price is required (must be greater than 0)";
    }

    // Validate category
    if (!formData.categoryId || Number(formData.categoryId) <= 0) {
      errors.categoryId = "Category is required";
    }

    // Validate at least one image
    if (!formData.images || formData.images.length === 0) {
      errors.images = "At least one image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const addImageUrl = useCallback(() => {
    const trimmedUrl = formData.imageUrl?.trim();
    
    if (!trimmedUrl) {
      setFormErrors((prev) => ({
        ...prev,
        imageUrl: "Please enter an image URL",
      }));
      return;
    }

    // Simple URL validation
    if (!trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      setFormErrors((prev) => ({
        ...prev,
        imageUrl: "URL must start with http:// or https://",
      }));
      return;
    }

    // Check for duplicates
    if (formData.images.includes(trimmedUrl)) {
      setFormErrors((prev) => ({
        ...prev,
        imageUrl: "This image URL already exists",
      }));
      return;
    }

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

  const removeImageUrl = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

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

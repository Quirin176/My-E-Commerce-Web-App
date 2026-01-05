import { useCallback, useState } from "react";
import { slugify } from "../../utils/slugify";

interface FormData {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  imageUrl: string;
  images: string[];
  categoryId: string | number;
  selectedOptionValueIds: (string | number)[];
}

interface FormErrors {
  [key: string]: string;
}

interface UseProductFormReturn {
  formData: FormData;
  formErrors: FormErrors;
  setFormData: (data: FormData) => void;
  setFormErrors: (errors: FormErrors) => void;
  updateField: (field: keyof FormData, value: any) => void;
  validateForm: () => boolean;
  addImageUrl: () => void;
  removeImageUrl: (index: number) => void;
  // updateImageUrl: (index: number, newUrl: string) => void;
  handleCategoryChange: (categoryId: string | number) => void;
  handleOptionChange: (optionValueId: string | number) => void;
  resetForm: () => void;
  getInitialFormData: () => FormData;
  autoGenerateSlug: (name: string) => void;
}

export const useProductForm = (): UseProductFormReturn => {
  const initialFormData: FormData = {
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

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const getInitialFormData = useCallback(() => initialFormData, []);

  const updateField = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Auto-generate slug when name changes
  const autoGenerateSlug = useCallback((name: string) => {
    if (name.trim()) {
      const generatedSlug = slugify(name);
      setFormData((prev) => ({
        ...prev,
        name: name,
        slug: generatedSlug,
      }));
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
    if (!formData.slug.trim()) {
      errors.slug = "Product slug is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Valid price is required";
    }
    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
    }
    if (!formData.images && formData.images.length === 0) {
      errors.imageUrl = "At least one image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const addImageUrl = useCallback(() => {
    if (formData.imageUrl && !formData.images.includes(formData.imageUrl)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.imageUrl],
        imageUrl: "",
      }));
    }
  }, [formData.imageUrl, formData.images]);

  const removeImageUrl = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleCategoryChange = useCallback((categoryId: string | number) => {
    setFormData((prev) => ({
      ...prev,
      categoryId,
      selectedOptionValueIds: [],
    }));
  }, []);

  const handleOptionChange = useCallback((optionValueId: string | number) => {
    setFormData((prev) => ({
      ...prev,
      selectedOptionValueIds: prev.selectedOptionValueIds.includes(optionValueId)
        ? prev.selectedOptionValueIds.filter((id) => id !== optionValueId)
        : [...prev.selectedOptionValueIds, optionValueId],
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormErrors({});
  }, [initialFormData]);

  return {
    formData,
    formErrors,
    setFormData,
    setFormErrors,
    updateField,
    validateForm,
    addImageUrl,
    removeImageUrl,
    handleCategoryChange,
    handleOptionChange,
    resetForm,
    getInitialFormData,
    autoGenerateSlug,
  };
};

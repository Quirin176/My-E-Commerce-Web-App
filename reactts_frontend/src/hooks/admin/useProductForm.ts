import { useCallback, useMemo, useState } from "react";
import { slugify } from "../../utils/slugify";
import type { Product } from "../../types/models/Product";

interface UseProductFormReturn {
  formData: Product;
  formErrors: Record<string, string>;
  setFormData: (data: Product) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  updateField: (field: keyof Product, value: unknown) => void;
  validateForm: () => boolean;
  addImageUrl: () => void;
  removeImageUrl: (index: number) => void;
  handleCategoryChange: (categoryId: number) => void;
  handleOptionChange: (optionValueId: number) => void;
  resetForm: () => void;
  getInitialFormData: () => Product;
  autoGenerateSlug: (name: string) => void;
}

export const useProductForm = (): UseProductFormReturn => {
  const initialFormData = useMemo<Product>(() => ({
    id: 0,
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: 0,
    imageUrl: "",
    images: [] as string[],
    categoryId: 0,
    selectedOptionValueIds: [] as Array<number>,
  }), []);

  const [formData, setFormData] = useState<Product>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const getInitialFormData = useCallback(() => initialFormData, [initialFormData]);

  const updateField = useCallback((field: keyof Product, value: unknown) => {
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
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
    if (!formData.slug.trim()) {
      errors.slug = "Product slug is required";
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = "Valid price is required";
    }
    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
    }
    if (!formData.images || formData.images.length === 0) {
      errors.imageUrl = "At least one image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const addImageUrl = useCallback(() => {
    if (formData.imageUrl && formData.imageUrl.trim()) {
      const newImageUrl = formData.imageUrl.trim();
      
      // Check if image already exists in array
      if (!formData.images?.includes(newImageUrl)) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), newImageUrl],
          imageUrl: "",  // Clear input after adding
        }));
      }
    }
  }, [formData.imageUrl, formData.images]);

  const removeImageUrl = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  }, []);

  const handleCategoryChange = useCallback((categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: typeof categoryId === 'string' ? parseInt(categoryId) : categoryId,
      selectedOptionValueIds: [],
    }));
  }, []);

  const handleOptionChange = useCallback((optionValueId: number) => {
    setFormData((prev) => {
      const currentOptions = prev.selectedOptionValueIds || [];
      const isSelected = currentOptions.some(id => 
        String(id) === String(optionValueId)
      );
      
      return {
        ...prev,
        selectedOptionValueIds: isSelected
          ? currentOptions.filter(id => String(id) !== String(optionValueId))
          : [...currentOptions, optionValueId],
      };
    });
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

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import type { Product } from "../../types/models/products/Product";
import type { ProductOption } from "../../types/models/products/ProductOption";
import type { ProductFormData } from "./useProductForm";

interface UseProductModalProps {
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  resetForm: () => void;
  loadFilters: (categoryId: number) => Promise<ProductOption[]>;
}

export const useProductModal = ({
  setFormData,
  resetForm,
  loadFilters,
}: UseProductModalProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isLoadingModalData, setIsLoadingModalData] = useState<boolean>(false);

  const mapSelectedOptionIds = (
    product: Product,
    filters: ProductOption[]
  ): number[] => {
    const map = new Map<string, number>();

    filters.forEach(f =>
      f.optionValues.forEach(v => map.set(v.value, v.id))
    );

    return (product.options ?? [])
      .flatMap(opt =>
        "optionValues" in opt
          ? opt.optionValues.map(v => map.get(v.value))
          : []
      )
      .filter((id): id is number => Boolean(id));
  };

  const loadProductIntoForm = useCallback(
    async (product: Product) => {
      setIsLoadingModalData(true);

      try {
        const images =
          Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : product.imageUrl
              ? [product.imageUrl]
              : [];

        // 1. Set base form
        setFormData({
          id: product.id ?? "",
          name: product.name ?? "",
          slug: product.slug ?? "",
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          price: product.price ?? 0,
          imageUrl: "",
          images,
          categoryId: product.categoryId ?? "",
          selectedOptionValueIds: [],
        });

        // 2. Load filters + map selected options
        if (product.categoryId) {
          const loadedFilters = await loadFilters(Number(product.categoryId));

          const selectedIds = mapSelectedOptionIds(product, loadedFilters);

          setFormData(prev => ({
            ...prev,
            selectedOptionValueIds: selectedIds,
          }));
        }
      } catch {
        toast.error("Failed to load product details");
      } finally {
        setIsLoadingModalData(false);
      }
    },
    [setFormData, loadFilters]
  );

  const openCreateForm = useCallback(() => {
    resetForm();
    setEditingId(null);
    setIsViewMode(false);
    setShowForm(true);
  }, [resetForm]);

  const openEditForm = useCallback(async (product: Product) => {
      setShowForm(true);
      setEditingId(Number(product.id));
      setIsViewMode(false);

      await loadProductIntoForm(product);
    },
    [loadProductIntoForm]
  );

  const openViewForm = useCallback(async (product: Product) => {
    setShowForm(true);
    setEditingId(Number(product.id));
    setIsViewMode(true);

    await loadProductIntoForm(product);
  },
    [loadProductIntoForm]
  );

  const close = useCallback(() => {
    resetForm();
    setShowForm(false);
    setEditingId(null);
    setIsViewMode(false);
  }, [resetForm]);

  return {
    showForm,
    editingId,
    isViewMode,
    isLoadingModalData,
    openCreateForm,
    openEditForm,
    openViewForm,
    close,
  };
};
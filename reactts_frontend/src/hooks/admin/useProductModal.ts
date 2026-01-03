import { useCallback, useState } from "react";

interface UseProductModalReturn {
  showForm: boolean;
  editingId: number | null;
  expandedProduct: number | null;
  setShowForm: (show: boolean) => void;
  setEditingId: (id: number | null) => void;
  setExpandedProduct: (id: number | null) => void;
  openCreateForm: () => void;
  openEditForm: (id: number) => void;
  closeForm: () => void;
  toggleExpandProduct: (id: number) => void;
}

export const useProductModal = (): UseProductModalReturn => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  const openCreateForm = useCallback(() => {
    setEditingId(null);
    setShowForm(true);
  }, []);

  const openEditForm = useCallback((id: number) => {
    setEditingId(id);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
  }, []);

  const toggleExpandProduct = useCallback((id: number) => {
    setExpandedProduct((prev) => (prev === id ? null : id));
  }, []);

  return {
    showForm,
    editingId,
    expandedProduct,
    setShowForm,
    setEditingId,
    setExpandedProduct,
    openCreateForm,
    openEditForm,
    closeForm,
    toggleExpandProduct,
  };
};

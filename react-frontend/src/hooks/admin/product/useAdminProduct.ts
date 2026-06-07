import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useProductForm } from "../useProductForm";
import { useCategories } from "../../products/useCategories";
import { useProductFilters } from "../../products/useProductFilters";

import { productApi } from "../../../api/products/productApi";
import { productvariantApi } from "../../../api/products/productvariantApi";
import { adminProductsApi, type ProductPayload } from "../../../api/admin/adminProductsApi";
import type { VariantRow } from "../../../types/models/products/variantTypes";
import type { ImagePayload } from "../../../api/admin/adminProductsApi";
import { productimageApi } from "../../../api/products/productimageApi";

export function useAdminProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    const mode = id ? "edit" : "create";

    const [createdProductId, setCreatedProductId] = useState<number | null>(null);
    const effectiveProductId = useMemo(
        () => (id ? Number(id) : createdProductId),
        [id, createdProductId]
    );

    const [recentProductImages, setRecentProductImages] = useState<ImagePayload[]>([])

    const [hasVariant, setHasVariant] = useState(false);
    const [variants, setVariants] = useState<VariantRow[]>([]);
    const [showManualForm, setShowManualForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { categories } = useCategories();
    const form = useProductForm();
    const filters = useProductFilters();

    const selectedIds = form.formData.selectedOptionValueIds ?? [];
    const [autoGenerate, setAutoGenerate] = useState<boolean>(false);

    const skuContext = useMemo(() => ({
        categoryName: categories.find((c) => c.id === Number(form.formData.categoryId))?.name ?? "",
        productName: form.formData.name,
    }), [categories, form.formData]);

    // ─────────────────────────────────────────────
    // Load product in edit mode
    // ─────────────────────────────────────────────
    useEffect(() => {
        if (mode !== "edit" || !id) return;

        (async () => {
            try {
                const product = await productApi.getProductById(Number(id));

                // Update form
                form.setFormData((prev) => ({
                    ...prev,
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    shortDescription: product.shortDescription ?? "",
                    description: product.description ?? "",
                    basePrice: product.basePrice,
                    thumbnailUrl: product.thumbnailUrl,
                    categoryId: Number(product.categoryId),
                    selectedOptionValueIds: [],
                    hasVariants: product.hasVariants
                }));

                setHasVariant(product.hasVariants);

                // Load filters & preselect options
                if (product.categoryId) {
                    const loadedFilters = await filters.loadFilters(Number(product.categoryId));

                    const valueMap = new Map<string, number>();
                    loadedFilters.forEach((opt: any) =>
                        opt.optionValues.forEach((v: any) => valueMap.set(v.value, v.id))
                    );

                    const preSelectedIds: number[] = [];
                    (product.options ?? []).forEach((opt: any) => {
                        (opt.optionValues ?? []).forEach((ov: any) => {
                            const fid = ov.id ?? valueMap.get(ov.value);
                            if (fid !== undefined) preSelectedIds.push(fid);
                        });
                    });

                    form.setFormData((prev) => ({
                        ...prev,
                        selectedOptionValueIds: preSelectedIds,
                    }));
                }

                const allImages = await productimageApi.GetByProduct(product.id);
                setRecentProductImages(allImages);

                // Load variants
                const allVariant = await productvariantApi.getByProductId(product.id);
                const mappedVariants = allVariant.map((v: any) => ({
                    ...v,
                    key: String(v.id),
                    open: false,
                    imageInput: "",
                    images: v.images ?? [],
                    optionValueIds:
                        v.optionValues?.map((ov: any) => ov.optionValueId ?? ov.id) ?? [],
                    serverId: v.id,
                }));

                setVariants(mappedVariants);
            } catch {
                toast.error("Failed to load product");
            }
        })();
    }, [id]);

    // ─────────────────────────────────────────────
    // Save product
    // ─────────────────────────────────────────────
    const submitProduct = async () => {
        if (!form.validateForm()) return;

        setSubmitting(true);
        try {
            const payload: ProductPayload = {
                ...form.formData,
                selectedOptionValueIds: selectedIds,
                hasVariants: hasVariant,
            };

            let result;

            if (mode === "create") {
                result = await adminProductsApi.createProduct(payload);
                setCreatedProductId(result.id);
                toast.success("Product created");
                navigate(`/admin/products/${result.id}/edit`);
            } else {
                await adminProductsApi.updateProductById(effectiveProductId!, payload);
                toast.success("Product updated");
            }
        } catch {
            toast.error("Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    return {
        mode,
        form,
        filters,
        categories,
        recentProductImages,
        hasVariant,
        setHasVariant,
        variants,
        setVariants,
        selectedIds,
        autoGenerate,
        setAutoGenerate,
        submitting,
        submitProduct,
        showManualForm,
        setShowManualForm,
        effectiveProductId,
        skuContext,
    };
}
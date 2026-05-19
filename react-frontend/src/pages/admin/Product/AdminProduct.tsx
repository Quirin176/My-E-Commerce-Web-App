import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Tabs, Tab, Box } from "@mui/material";

import { useAdminProduct } from "../../../hooks/admin/product/useAdminProduct";
import { useProductImages } from "../../../hooks/admin/product/useProductImages";
import { useSaveProductImages } from "../../../hooks/admin/product/useSaveProductImages";

import type { VariantRow } from "../../../types/models/products/variantTypes";

import ToggleSwitch from "../../../components/ToggleSwitch";
import ProductVariantsSection from "../../../components/Admin/Products/ProductVariantsSection";
import ProductInfoTab from "./ProductInfoTab";
import { ProductAttributesTab } from "./ProductAttributesTab";
import ImagesTab from "./ImagesTab";
import ManualVariantForm from "../../../components/Admin/Products/ManualVariantForm";

// ─── Tab panel helper ──────────────────────────────────────────────────────────
interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function AdminProduct() {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

    const {
        mode,
        form,
        filters,
        categories,
        images,
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
    } = useAdminProduct();

    const productImages = useProductImages();
    const { submittingImages, saveImages } = useSaveProductImages();

    const handleSaveImages = () => saveImages(effectiveProductId, productImages.images);

    // ── Add manually-entered variant row to the list ─────────────────────────────
    const handleAddManualVariant = (row: VariantRow) => {
        setVariants((prev) => [...prev, row]);
        setShowManualForm(false);
        toast.success(`Variant "${row.variantName}" added`);
    };

    // ── Tab visibility ────────────────────────────────────────────────────────────
    const showAttributesTab = !!form.formData.categoryId && filters.filters.length > 0;
    const showVariantsTab = hasVariant;

    const attributesTabIndex = 1;
    const addProductImagesIndex = showAttributesTab && !showVariantsTab ? 2 : 1;
    const variantsTabIndex = showAttributesTab && showVariantsTab ? 2 : 1;

    return (
        <div className="w-full overflow-y-auto">
            <Box sx={{ width: "100%" }}>
                <Tabs value={tabIndex} onChange={(_, nv) => setTabIndex(nv)}>
                    <Tab label="Product" />
                    {showAttributesTab && <Tab label="Attributes" />}
                    {showVariantsTab ? <Tab label="Variants" /> : <Tab label="Product Images" />}
                </Tabs>

                {/* ── TAB 0: Product basic info ── */}
                <TabPanel value={tabIndex} index={0}>
                    <ProductInfoTab
                        mode="add"
                        submitting={false}
                        onSubmit={() => setTabIndex(1)}
                        onCategoryChange={setSelectedCategoryId}
                    />
                </TabPanel>

                {/* ── TAB 1: Attributes ── */}
                {showAttributesTab && (
                    <TabPanel value={tabIndex} index={attributesTabIndex}>
                        <ProductAttributesTab
                            mode=""
                            selectedOptionValueIds={ }
                            handleOptionChange={ }
                            hasVariant={ }
                            setHasVariant={ }
                            submittingProduct={ }
                            submitProduct={ }
                        />
                    </TabPanel>
                )}

                {/* ── TAB 2: Variants ── */}
                {showVariantsTab ? (
                    <TabPanel value={tabIndex} index={variantsTabIndex}>
                        <div className="space-y-4">
                            <div className="flex flex-row justify-between items-center">
                                <label className="text-2xl font-bold text-black">Product Variants</label>
                                <ToggleSwitch
                                    label="Auto-generate?"
                                    checked={autoGenerate}
                                    onChange={(val) => setAutoGenerate(val)} />
                            </div>

                            {/* Info banner when product not yet saved */}
                            {!effectiveProductId && (
                                <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-800">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">Product not saved yet</p>
                                        <p className="text-xs mt-0.5">Go to the <strong>Product</strong> tab and click <strong>Create Product</strong> first. Then come back here to add variants.</p>
                                    </div>
                                </div>
                            )}

                            {effectiveProductId && (
                                <ProductVariantsSection
                                    autoGenerate={autoGenerate}
                                    productId={effectiveProductId}
                                    filters={filters.filters}
                                    selectedOptionValueIds={selectedIds}
                                    mode={mode}
                                    onChange={setVariants}
                                    initialRows={variants}
                                    skuContext={skuContext}
                                />
                            )}

                            {effectiveProductId && (
                                <>
                                    {!showManualForm ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowManualForm(true)}
                                            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-blue-400 text-blue-600 rounded-xl hover:bg-blue-50 transition text-sm font-semibold w-full justify-center"
                                        >
                                            <Plus size={16} />
                                            Add Variant Manually
                                        </button>
                                    ) : (
                                        <ManualVariantForm
                                            filters={filters.filters}
                                            selectedProductOptionValueIds={selectedIds}
                                            skuContext={skuContext}
                                            onAdd={handleAddManualVariant}
                                            onCancel={() => setShowManualForm(false)}
                                        />
                                    )}
                                </>
                            )}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/products")}
                                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                                >
                                    Done / Skip
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                ) : (
                    /* ── TAB 2: Product Images (no-variant path) ── */
                    <TabPanel value={tabIndex} index={addProductImagesIndex}>
                        <ImagesTab
                            productId={effectiveProductId}
                            images={productImages.images}
                            imageInput={productImages.imageInput}
                            setImageInput={productImages.setImageInput}
                            addImage={productImages.addImage}
                            removeImage={productImages.removeImage}
                            submittingImages={submittingImages}
                            onSave={handleSaveImages}
                        />
                    </TabPanel>
                )}
            </Box>
        </div >
    );
}
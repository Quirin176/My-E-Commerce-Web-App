import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

import { useAdminProduct } from "../../../hooks/admin/product/useAdminProduct";
import { useProductImages } from "../../../hooks/admin/product/useProductImages";
import { useSaveProductImages } from "../../../hooks/admin/product/useSaveProductImages";

import ProductInfoTab from "./ProductInfoTab";
import ProductAttributesTab from "./ProductAttributesTab";
import ImagesTab from "./ImagesTab";
import ProductVariantsTab from "./ProductVariantsTab";

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
    const [tabIndex, setTabIndex] = useState(0);

    const {
        mode,
        form,
        filters,
        categories,
        hasVariant,
        setHasVariant,
        variants,
        setVariants,
        selectedIds,
        autoGenerate,
        setAutoGenerate,
        submitting,
        submitProduct,
        effectiveProductId,
        skuContext,
    } = useAdminProduct();

    // ── Handle product info submit: validate then move to attributes tab ───────
    const handleInfoSubmit = () => {
        if (!form.validateForm()) return;
        setTabIndex(1);
    };

    const productImages = useProductImages();
    const { submittingImages, saveImages } = useSaveProductImages();

    const handleSaveImages = () => saveImages(effectiveProductId, productImages.images);

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
                        mode={mode}
                        form={form}
                        filters={filters}
                        categories={categories}
                        submitting={false}
                        onSubmit={handleInfoSubmit}
                        onCategoryChange={() => {
                            // Reset to tab 0 if category changes so user re-selects attributes
                            setTabIndex(0);
                        }}
                    />
                </TabPanel>

                {/* ── TAB 1: Attributes (only when category has options) ── */}
                {showAttributesTab && (
                    <TabPanel value={tabIndex} index={attributesTabIndex}>
                        <ProductAttributesTab
                            mode={mode}
                            filters={filters}
                            selectedOptionValueIds={selectedIds}
                            handleOptionChange={form.handleOptionChange}
                            hasVariant={hasVariant}
                            setHasVariant={setHasVariant}
                            submittingProduct={submitting}
                            submitProduct={submitProduct}
                        />
                    </TabPanel>
                )}

                {/* ── TAB 2: Variants ── */}
                {showVariantsTab ? (
                    <TabPanel value={tabIndex} index={variantsTabIndex}>
                        <ProductVariantsTab
                            mode={mode}
                            productId={effectiveProductId}
                            filters={filters.filters}
                            selectedOptionValueIds={selectedIds}
                            variants={variants}
                            setVariants={setVariants}
                            autoGenerate={autoGenerate}
                            setAutoGenerate={setAutoGenerate}
                            skuContext={skuContext}
                        />
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
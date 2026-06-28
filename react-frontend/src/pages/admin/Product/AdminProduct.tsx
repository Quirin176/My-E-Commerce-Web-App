import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Tab, Tabs } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";

import { useAdminProduct } from "../../../hooks/admin/product/useAdminProduct";
import { useProductImages } from "../../../hooks/admin/product/useProductImages";
import { useSaveProductImages } from "../../../hooks/admin/product/useSaveProductImages";

import ProductInfoTab from "./ProductInfoTab";
import ProductAttributesTab from "./ProductAttributesTab";
import ImagesTab from "./ProductImagesTab";
import ProductVariantsTab from "./ProductVariantsTab";

// ─── Tab panel helper ──────────────────────────────────────────────────────────
interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}

function a11yProps(index: number) {
    return {
        id: `product-tab-${index}`,
        "aria-controls": `product-tabpanel-${index}`,
    };
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`product-tabpanel-${index}`}
            aria-labelledby={`product-tab-${index}`}
        >
            {value === index && children}
        </Box>
    );
}

const tabs = [
    {
        label: "Product details",
        shortLabel: "Product",
        icon: <Inventory2OutlinedIcon />,
        description: "Basic product information",
    },
    {
        label: "Attributes",
        shortLabel: "Attributes",
        icon: <TuneOutlinedIcon />,
        description: "Options such as size or color",
    },
    {
        label: "Images",
        shortLabel: "Images",
        icon: <ImageOutlinedIcon />,
        description: "Product gallery and cover image",
    },
    {
        label: "Variants",
        shortLabel: "Variants",
        icon: <ViewInArOutlinedIcon />,
        description: "SKU, stock, and pricing combinations",
    },
];

// ─── Main component ────────────────────────────────────────────────────────────

export default function AdminProduct() {
    const [tabIndex, setTabIndex] = useState(0);
    const navigate = useNavigate();

    const {
        mode,
        form,
        filters,
        // filterOptions,
        categories,
        recentProductImages,
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

    const handleAttibutesSubmit = () => {
        submitProduct();
        setTabIndex(2);
    };

    const productImages = useProductImages(recentProductImages);
    const { submittingImages, saveImages } = useSaveProductImages();

    const handleSaveImages = () => {
        saveImages(effectiveProductId, productImages.images);
        navigate(`/admin/products`);
    }

    return (
        <div className="w-full h-full overflow-y-auto p-4 md:p-6 bg-(--bg-muted)">
            <div className="mx-auto">

                {/* Page heading */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        {mode === "create" ? "Create product" : "Edit product"}
                    </h1>

                    <p className="text-(--text-muted) font-bold">
                        Complete the product information, configure options, then add
                        images and variants.
                    </p>
                </div>

                {/* Tab navigation */}
                <div className="border-2 border-(--border) rounded-2xl bg-(--bg-surface) overflow-hidden">
                    <Tabs
                        value={tabIndex}
                        onChange={(_, newValue: number) => setTabIndex(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="Product editor tabs"
                        sx={{
                            borderBottom: 2,
                            borderColor: "var(--border)",

                            "& .MuiTab-root": {
                                borderRadius: 2,
                                color: "var(--text-primary)",
                                textTransform: "none",
                                alignItems: "flex-start",
                                justifyContent: "center",
                                transition: "all 0.2s ease",

                                "&:hover": {
                                    background: "var(--bg-muted)",
                                    color: "var(--text-primary)",
                                },
                            },

                            "& .MuiTab-root.Mui-selected": {
                                background: "var(--brand-primary)",
                                color: "white",
                            },
                        }}
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                key={tab.label}
                                icon={tab.icon}
                                iconPosition="start"
                                label={
                                    <div className="text-left">
                                        <span className="block font-bold">{tab.label}</span>

                                        <span className={`text-xs font-bold ${index == tabIndex ? 'text-white' : 'text-(--text-muted)'}`}>
                                            {tab.description}
                                        </span>
                                    </div>
                                }
                                {...a11yProps(index)}
                            />
                        ))}
                    </Tabs>

                    {/* Content card */}
                    <div className="min-h-120 p-4">

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
                        <TabPanel value={tabIndex} index={1}>
                            <ProductAttributesTab
                                mode={mode}
                                filters={filters}
                                selectedOptionValueIds={selectedIds}
                                handleOptionChange={form.handleOptionChange}
                                submittingProduct={submitting}
                                submitProduct={handleAttibutesSubmit}
                            />
                        </TabPanel>

                        {/* ── TAB 2: Product Images (no-variant path) ── */}
                        <TabPanel value={tabIndex} index={2}>
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

                        {/* ── TAB 3: Variants ── */}
                        <TabPanel value={tabIndex} index={3}>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
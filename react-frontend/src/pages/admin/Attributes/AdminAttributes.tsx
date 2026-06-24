import { useEffect, useState } from "react";
import { useCategories } from "../../../hooks/products/useCategories";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import { productoptionApi } from "../../../api/products/productoptionApi";
import { productoptionvalueApi } from "../../../api/products/productoptionvalueApi";
import type { Category } from "../../../types/models/products/Category";
import type { ProductOption } from "../../../types/models/products/Product";

import AttributeModal, { type ModalConfig } from "../../../components/admin/attributes/AttributeModal";
import AttributeDeleteModal, { type DeleteConfig } from "../../../components/admin/attributes/AttributeDeleteModal";
import AttributesSection from "./AttributesSection";
import AttributeValuesSection from "./AttributeValuesSection";

export default function AdminAttributes() {
    const { categories } = useCategories();;
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loadedOptions, setLoadedOptions] = useState<ProductOption[]>([]);
    const [selectedOptionId, setSelectedOptionId] = useState<number>(0);

    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
    const [deleteConfig, setDeleteConfig] = useState<DeleteConfig | null>(null);

    const selectedOption = loadedOptions.find(o => o.optionId === selectedOptionId);

    useEffect(() => {
        if (!selectedCategory) return;

        // Load Option of Selected Category
        const fetchOptions = async () => {
            const res = await productoptionApi.getOptionsByCategoryId(selectedCategory.id);

            setLoadedOptions(res);
        };

        fetchOptions();
    }, [selectedCategory]);

    const refresh = async () => {
        if (!selectedCategory) return;

        const res = await productoptionApi.getOptionsByCategoryId(selectedCategory.id);

        setLoadedOptions(res);
    };

    // ── Modal openers ──
    const openAddCategory = () =>
        setModalConfig({
            mode: "add-category",
            title: "Add Category",
            label: "Category Name",
            placeholder: "e.g. Laptop",
            initialValue: "",
        });

    const openAddOption = () => {
        if (!selectedCategory) return;
        setModalConfig({
            mode: "add-option",
            title: "Add Attribute",
            label: "Attribute Name",
            placeholder: "e.g. RAM",
            initialValue: "",
            categoryId: selectedCategory.id,
        });
    };

    const openEditOption = (option: ProductOption) =>
        setModalConfig({
            mode: "edit-option",
            title: "Edit Attribute",
            label: "Attribute Name",
            placeholder: "",
            initialValue: option.optionName,
            optionId: option.optionId,
        });

    const openAddValue = (optionId: number) =>
        setModalConfig({
            mode: "add-value",
            title: "Add Value",
            label: "Value",
            placeholder: "e.g. 16GB",
            initialValue: "",
            optionId,
        });

    const openEditValue = (optionValueId: number, value: string) =>
        setModalConfig({
            mode: "edit-value",
            title: "Edit Value",
            label: "Value",
            placeholder: "",
            initialValue: value,
            optionValueId,
        });

    // ── Delete handlers ──
    const confirmDeleteOption = (option: ProductOption) =>
        setDeleteConfig({
            label: option.optionName,
            onConfirm: async () => {
                await productoptionApi.deleteProductOption(option.optionId);
                toast.success("Attribute deleted!");
                refresh();
            },
        });

    const confirmDeleteValue = (optionValueId: number, value: string) =>
        setDeleteConfig({
            label: value,
            onConfirm: async () => {
                await productoptionvalueApi.deleteOptionValue(optionValueId);
                toast.success("Value deleted!");
                refresh();
            },
        });

    return (
        <div className="h-full w-full flex flex-col gap-y-4 p-8 bg-(--bg-muted)">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Categories</h1>

                <button
                    onClick={() => openAddCategory()}
                    className="flex items-center rounded-full px-4 py-2 gap-2 transition cursor-pointer
                    text-white bg-(--brand-primary) hover:brightness-75 font-semibold"
                >
                    <Plus size={18} />
                    <span>Add Category</span>
                </button>
            </div>

            {/* CATEGORIES */}
            <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                    {categories?.map((category) =>
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full font-semibold px-4 py-2 cursor-pointer border-2
                                ${category.name === selectedCategory?.name ? "bg-(--brand-primary) text-white border-white"
                                    : "bg-(--bg-surface) text-(--brand-primary) border-(--brand-primary) hover:border-(--text-primary)"
                                }`}
                        >
                            {category.name}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => openAddOption()}
                    className="flex items-center rounded-full px-4 py-2 gap-2 transition cursor-pointer
                    text-white bg-(--brand-primary) hover:brightness-75 font-semibold"
                >
                    <Plus size={18} />
                    <span>Add Attribute</span>
                </button>
            </div>

            {!selectedCategory ? (
                <div>
                    <p>Select A Category First</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <AttributesSection
                        loadedOptions={loadedOptions}
                        selectedOptionId={selectedOptionId}
                        onSelectOption={setSelectedOptionId}
                        onAddValue={openAddValue}
                        onEditOption={openEditOption}
                        onDeleteOption={confirmDeleteOption}
                    />

                    <AttributeValuesSection
                        selectedOption={selectedOption}
                        onEditValue={openEditValue}
                        onDeleteValue={confirmDeleteValue}
                    />
                </div>
            )}

            <AttributeModal
                config={modalConfig}
                onClose={() => setModalConfig(null)}
                onSuccess={refresh}
            />

            <AttributeDeleteModal
                config={deleteConfig}
                onClose={() => setDeleteConfig(null)}
            />
        </div >
    )
}
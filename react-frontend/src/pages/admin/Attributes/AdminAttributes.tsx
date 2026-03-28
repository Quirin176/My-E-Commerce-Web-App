import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, SquarePen, X } from "lucide-react";
import { categoryApi } from "../../../api/products/categoryApi";
import { productoptionApi } from "../../../api/products/productoptionApi";
import { productoptionvalueApi } from "../../../api/products/productoptionvalueApi";
import type { Category } from "../../../types/models/products/Category";
import type { ProductOption } from "../../../types/models/products/ProductOption";

import type { ModalConfig } from "../../../components/Admin/Attributes/AdminAttributesAddEditForm";
import AdminAttributesModal from "../../../components/Admin/Attributes/AdminAttributesAddEditForm";
import type { DeleteConfig } from "../../../components/Admin/Attributes/AdminAttributesDeleteForm";
import AdminAttributesDeleteModal from "../../../components/Admin/Attributes/AdminAttributesDeleteForm";

export default function AdminAttributes() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loadedOption, setLoadedOption] = useState<ProductOption[]>([]);
    const [selectedOptionId, setSelectedOptionId] = useState<number>(0);

    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
    const [deleteConfig, setDeleteConfig] = useState<DeleteConfig | null>(null);

    // Load Categories
    const loadCategories = () => {
        categoryApi.getAll().then(setCategories);
    };

    // Load Option of Selected Category
    const loadOptions = (categoryId: number) => {
        if (!selectedCategory) return;
        productoptionApi.getOptionsByCategoryId(categoryId).then(setLoadedOption);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;
        loadOptions(selectedCategory.id);
    }, [selectedCategory]);

    const refresh = () => {
        loadCategories();
        if (selectedCategory) loadOptions(selectedCategory.id);
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
                // await productoptionApi.deleteProductOption(option.optionId);
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
        <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-bold">Categories</h1>

            <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                    {categories?.map((category) =>
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category)}
                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 cursor-pointer"
                        >
                            {category.name}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => openAddCategory()}
                    className="flex items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 gap-2 cursor-pointer"
                >
                    <Plus size={18} />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="flex justify-between gap-2">
                <h2 className="text-2xl font-bold">Attributes</h2>

                <button
                    onClick={() => openAddOption()}
                    className="flex items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 gap-2 cursor-pointer"
                >
                    <Plus size={18} />
                    <span>Add Attribute</span>
                </button>
            </div>

            <div>
                {!selectedCategory ? (
                    <div>
                        <p>Select A Category First</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-y-4">
                        {loadedOption.map((option) => (
                            <div key={option.optionId} className="flex flex-col gap-3">

                                {/* Option Header */}
                                <div
                                    onClick={() => {
                                        if (option.optionId === selectedOptionId) setSelectedOptionId(0)
                                        else setSelectedOptionId(option.optionId);
                                    }}
                                    className="flex justify-between items-center rounded-xl bg-blue-600 text-white font-semibold px-4 py-2 shadow cursor-pointer">
                                    <span>{option.optionName}</span>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => openAddValue(option.optionId)}
                                            className="cursor-pointer hover:opacity-70 transition" title="Add Attribute Value">
                                            <Plus size={18} />
                                        </button>
                                        <button
                                            onClick={() => openEditOption(option)}
                                            className="cursor-pointer hover:opacity-70 transition" title="Update Attribute">
                                            <SquarePen size={18} />
                                        </button>
                                        <button
                                            onClick={() => confirmDeleteOption(option)}
                                            className="cursor-pointer hover:opacity-70 transition" title="Remove Attribute">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Option Values */}
                                {option.optionId === selectedOptionId && (
                                    <div className="flex flex-col gap-2 ml-4">
                                        {option.optionValues.map((value) => (
                                            <div
                                                key={value.optionValueId}
                                                className="flex justify-between items-center rounded-xl border border-blue-600 text-blue-600 font-medium px-4 py-2"
                                            >
                                                <span>{value.value}</span>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => openEditValue(value.optionValueId, value.value)}
                                                        className="cursor-pointer hover:opacity-70 transition" title="Update Attribute Value">
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDeleteValue(value.optionValueId, value.value)}
                                                        className="cursor-pointer hover:opacity-70 transition" title="Remove Attribute Value">
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>)
                                }
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AdminAttributesModal
                config={modalConfig}
                onClose={() => setModalConfig(null)}
                onSuccess={refresh}
            />

            <AdminAttributesDeleteModal
                config={deleteConfig}
                onClose={() => setDeleteConfig(null)}
            />
        </div>
    )
}

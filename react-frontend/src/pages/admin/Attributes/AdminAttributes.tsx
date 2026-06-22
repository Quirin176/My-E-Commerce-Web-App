import { useEffect, useState } from "react";
import { useCategories } from "../../../hooks/products/useCategories";
import toast from "react-hot-toast";
import { Plus, SquarePen, X } from "lucide-react";
import { productoptionApi } from "../../../api/products/productoptionApi";
import { productoptionvalueApi } from "../../../api/products/productoptionvalueApi";
import type { Category } from "../../../types/models/products/Category";
import type { ProductOption } from "../../../types/models/products/Product";

import AttributeModal, { type ModalConfig } from "../../../components/admin/attributes/AttributeModal";
import AttributeDeleteModal, { type DeleteConfig } from "../../../components/admin/attributes/AttributeDeleteModal";

export default function AdminAttributes() {
    const { categories } = useCategories();;
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loadedOption, setLoadedOption] = useState<ProductOption[]>([]);
    const [selectedOptionId, setSelectedOptionId] = useState<number>(0);

    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
    const [deleteConfig, setDeleteConfig] = useState<DeleteConfig | null>(null);

    const selectedOption = loadedOption.find(o => o.optionId === selectedOptionId);

    useEffect(() => {
        if (!selectedCategory) return;

        // Load Option of Selected Category
        const fetchOptions = async () => {
            const res =
                await productoptionApi.getOptionsByCategoryId(selectedCategory.id);

            setLoadedOption(res);
        };

        fetchOptions();
    }, [selectedCategory]);

    const refresh = async () => {
        if (!selectedCategory) return;

        const res =
            await productoptionApi.getOptionsByCategoryId(selectedCategory.id);

        setLoadedOption(res);
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
                    className="flex items-center rounded-full bg-(--brand-primary) hover:brightness-75 text-white font-semibold px-4 py-2 gap-2 transition cursor-pointer"
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
                                ${category.name === selectedCategory?.name ? "bg-(--brand-primary) border-(--text-primary)"
                                    : "bg-(--bg-surface) border-(--brand-primary) hover:border-(--text-primary)"
                                }`}
                        >
                            {category.name}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => openAddOption()}
                    className="flex items-center rounded-full bg-(--brand-primary) hover:brightness-75 text-white font-semibold px-4 py-2 gap-2 transition cursor-pointer"
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

                    {/* LEFT: ATTRIBUTES */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold pb-4">Attributes</h2>

                        <div className="flex flex-col gap-4">
                            {loadedOption.map((option) => (
                                <div
                                    key={option.optionId}
                                    className={`h-16 flex justify-between items-center rounded-xl bg-(--bg-surface)
                                    border-2 px-4 py-2 cursor-pointer group transition
                                    ${selectedOptionId === option.optionId ?
                                            "bg-(--brand-primary) border-white" : "border-(--brand-primary) hover:border-(--text-primary)"
                                        }`}
                                    onClick={() => setSelectedOptionId(option.optionId)}
                                >
                                    {/* OPTION NAME */}
                                    <div className="flex-1">
                                        <span className="font-bold">
                                            {option.optionName}
                                        </span>
                                    </div>

                                    {/* BUTTONS */}
                                    <div
                                        className="flex items-center gap-3"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => openAddValue(option.optionId)}
                                            className="rounded-xl border-2 p-1"
                                            title="Add Attribute Value"
                                        >
                                            <Plus size={18} />
                                        </button>

                                        <button
                                            onClick={() => openEditOption(option)}
                                            className="rounded-xl border-2 p-1"
                                            title="Update Attribute"
                                        >
                                            <SquarePen size={18} />
                                        </button>

                                        <button
                                            onClick={() => confirmDeleteOption(option)}
                                            className="rounded-xl border-2 p-1"
                                            title="Remove Attribute"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: ATTRIBUTE VALUES */}
                    {!selectedOption ? (
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold pb-4">
                                Attribute Values
                            </h2>

                            <div className="rounded-xl bg-(--bg-surface) border-2 border-(--brand-primary) p-4">
                                Select an attribute
                            </div>

                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold pb-4">
                                {selectedOption.optionName} Values
                            </h2>

                            {selectedOption.optionValues.length === 0 ? (
                                <div className="rounded-xl bg-(--bg-surface) p-4">
                                    No values found
                                </div>
                            ) : (
                                selectedOption.optionValues.map((value) => (
                                    <div
                                        key={value.optionValueId}
                                        className="flex justify-between items-center rounded-xl border-2
                                            border-(--brand-primary) bg-(--bg-surface) hover:border-(--text-primary)
                                            px-4 py-2 cursor-pointer"
                                        onClick={() => openEditValue(value.optionValueId, value.value)}
                                    >
                                        <span>{value.value}</span>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => openEditValue(value.optionValueId, value.value)}
                                                className="rounded-xl border-2 p-1 cursor-pointer"
                                                title="Update Attribute Value"
                                            >
                                                <SquarePen size={18} />
                                            </button>

                                            <button
                                                onClick={() => confirmDeleteValue(value.optionValueId, value.value)}
                                                className="rounded-xl border-2 p-1 cursor-pointer"
                                                title="Remove Attribute Value"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

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
import { useEffect, useState } from "react";
import { Plus, SquarePen, X } from "lucide-react";
import { categoryApi } from "../../api/products/categoryApi";
import { productoptionApi } from "../../api/products/productoptionApi";
import type { Category } from "../../types/models/products/Category";
import type { ProductOption } from "../../types/models/products/ProductOption";
import type { ProductOptionValue } from "../../types/models/products/ProductOptionValue";

export default function AdminAttributes() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loadedOption, setLoadedOption] = useState<ProductOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    // const [loadedOptionValue, setLoadedOptionValue] = useState<ProductOptionValue[]>([]);

    // Load Categories
    useEffect(() => {
        categoryApi.getAll().then(setCategories);
    }, []);

    // Load Option of Selected Category
    useEffect(() => {
        if (!selectedCategory) return;
        productoptionApi.getOptionsByCategoryId(selectedCategory.id).then(setLoadedOption);
    }, [selectedCategory])

    // const handleAddCategory = async () => {
    //     categoryApi.createCategory();
    // };

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
                    className="flex items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 gap-2 cursor-pointer"
                >
                    <Plus size={18} />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="flex justify-between gap-2">
                <h2 className="text-2xl font-bold">Attributes</h2>

                <button
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
                                        if (option === selectedOption) setSelectedOption(null)
                                        else setSelectedOption(option);
                                    }}
                                    className="flex justify-between items-center rounded-xl bg-blue-600 text-white font-semibold px-4 py-2 shadow cursor-pointer">
                                    <span>{option.optionName}</span>

                                    <div className="flex items-center gap-3">
                                        <button className="cursor-pointer hover:opacity-70 transition">
                                            <Plus size={18} />
                                        </button>
                                        <button className="cursor-pointer hover:opacity-70 transition">
                                            <SquarePen size={18} />
                                        </button>
                                        <button className="cursor-pointer hover:opacity-70 transition">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Option Values */}
                                {option === selectedOption && (
                                    <div className="flex flex-col gap-2 ml-4">
                                        {selectedOption.optionValues.map((value) => (
                                            <div
                                                key={value.optionValueId}
                                                className="flex justify-between items-center rounded-xl border border-blue-600 text-blue-600 font-medium px-4 py-2"
                                            >
                                                <span>{value.value}</span>

                                                <div className="flex items-center gap-3">
                                                    <button className="cursor-pointer hover:opacity-70 transition">
                                                        <SquarePen size={18} />
                                                    </button>
                                                    <button className="cursor-pointer hover:opacity-70 transition">
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
        </div>
    )
}

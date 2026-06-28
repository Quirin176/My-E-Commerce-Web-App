import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useCategories } from "../../../hooks/products/useCategories";
import { categoryApi } from "../../../api/products/categoryApi";
import type { ProductOption } from "../../../types/models/products/Product";

export interface DynamicFiltersProps {
    onCategoryChange: (slug: string) => void;
    selectedCategory?: string | null;
    selectedOptions: (string | number)[];
    setSelectedOptions: (option: (string | number)[]) => void;
    minPrice: string | number;
    setMinPrice: (price: string | number) => void;
    maxPrice: string | number;
    setMaxPrice: (price: string | number) => void;
    sortOrder: string;
    setSortOrder: (order: string) => void;
    onApplyFilters: () => void;
}

export default function DynamicFilters({
    onCategoryChange,
    selectedCategory,
    selectedOptions,
    setSelectedOptions,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    sortOrder,
    setSortOrder,
    onApplyFilters
}: DynamicFiltersProps) {

    const { categories } = useCategories();
    const [loadedOptions, setLoadedOptions] = useState<ProductOption[]>([]);
    const [loadingFilters, setLoadingFilters] = useState(false);

    const [openDropdowns, setOpenDropdowns] = useState<Record<string | number, boolean>>({});

    const handleCategoryChange = async (slug: string) => {
        // notify parent about the selected category
        onCategoryChange(slug);

        // then load option data for the category
        await loadOptionsForCategory(slug);
    };

    // load option data without notifying parent (used on mount / when returning to page)
    const loadOptionsForCategory = async (slug: string | null | undefined) => {
        if (!slug) {
            setLoadedOptions([]);
            return;
        }

        setLoadingFilters(true);

        try {
            const filters = await categoryApi.getAllChildDataByCategorySlug(slug);
            const filterList = Array.isArray(filters) ? filters : (filters?.data || []);
            setLoadedOptions(filterList);
        } catch {
            toast.error("Failed to load category filters");
            setLoadedOptions([]);
        } finally {
            setLoadingFilters(false);
        }
    };

    // initialize/load options when `selectedCategory` prop changes (e.g. returning from edit page)
    useEffect(() => {
        loadOptionsForCategory(selectedCategory);
    }, [selectedCategory]);

    // Toggle dropdown for specific category
    const toggleDropdown = (categoryId: string | number) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // Close dropdown when mouse leaves
    const closeDropdown = (categoryId: string | number) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [categoryId]: false
        }));
    };

    // Toggle option selection - handles both string and number IDs
    const toggleOption = (optionValueId: string | number) => {
        if (selectedOptions.includes(optionValueId)) {
            setSelectedOptions(selectedOptions.filter(o => o !== optionValueId));
        } else {
            setSelectedOptions([...selectedOptions, optionValueId]);
        }
    };

    // Guard against invalid options
    const options = Array.isArray(loadedOptions) && loadedOptions.length > 0 ? loadedOptions : [];

    return (
        <div className="w-full h-full p-3 rounded shadow border">

            <div className="flex flex-wrap gap-2 items-center">

                {/* Category Select Box */}
                <select
                    disabled={loadingFilters}
                    value={selectedCategory ?? ""}
                    onChange={(e) => handleCategoryChange(e.target.value ? e.target.value : "")}
                    className="text-xs font-bold border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                    <option value="" className="font-bold bg-(--bg-muted)">Category</option>

                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug} className="font-bold bg-(--bg-muted)">
                            {cat.name}
                        </option>
                    ))}
                </select>

                {loadingFilters && (
                    <div className="ml-2 text-xs">Loading options…</div>
                )}

                {/* Dynamic Option Dropdowns */}
                {options.length > 0 && (
                    <>
                        {options.map(option => {
                            const selectedInCategory = selectedOptions.filter(id =>
                                option.optionValues.some(v => v.optionValueId === id)
                            );

                            return (
                                <div key={option.optionId} className="relative">
                                    <button
                                        onClick={() => toggleDropdown(option.optionId)}
                                        className="flex items-center justify-between border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-w-28"
                                    >
                                        <span className="truncate text-xs font-bold">
                                            {option.optionName}
                                            {selectedInCategory.length > 0 && (
                                                <span className="ml-1 text-xs bg-(--brand-primary) px-1.5 py-0.5 rounded inline-block">
                                                    {selectedInCategory.length}
                                                </span>
                                            )}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`transition ml-1 shrink-0 ${openDropdowns[option.optionId] ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {openDropdowns[option.optionId] && (
                                        <div
                                            className="absolute top-full left-0 mt-1 bg-(--bg-muted) border rounded shadow-lg z-50 w-40"
                                            onMouseLeave={() => closeDropdown(option.optionId)}>
                                            <div className="p-2 max-h-48 overflow-y-auto">
                                                {option.optionValues.map((value) => (
                                                    <label
                                                        key={value.optionValueId}
                                                        className="flex items-center gap-2 px-2 py-1.5 rounded text-(--text-primary) hover:text-(--text-secondary) hover:bg-gray-100 transition cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedOptions.includes(value.optionValueId)}
                                                            onChange={() => {toggleOption(value.optionValueId); console.log(value.optionValueId)}}
                                                            className="w-3 h-3"
                                                        />
                                                        <span className="text-xs font-bold">{value.value}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}

                {/* Price Range and Sort - At the end */}
                <div className="ml-auto flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <label className="text-xs font-bold whitespace-nowrap">Price: From</label>
                        <input
                            placeholder="Min"
                            type="number"
                            className="border p-1.5 rounded w-24 text-xs font-bold"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span className="text-xs font-bold">to</span>
                        <input
                            placeholder="Max"
                            type="number"
                            className="border p-1.5 rounded w-24 text-xs font-bold"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        className="border p-1.5 rounded text-xs font-bold min-w-32 transition cursor-pointer"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest" className="font-bold bg-(--bg-muted)">Newest</option>
                        <option value="oldest" className="font-bold bg-(--bg-muted)">Oldest</option>
                        <option value="ascending" className="font-bold bg-(--bg-muted)">Low → High</option>
                        <option value="descending" className="font-bold bg-(--bg-muted)">High → Low</option>
                    </select>

                    <button
                        disabled={loadingFilters}
                        className="border p-1.5 rounded-lg text-xs min-w-32 font-bold text-white bg-(--brand-primary) hover:bg-(--brand-secondary) transition cursor-pointer"
                        onClick={() => {
                            // sanitize price inputs
                            const cleanedMin = minPrice === "" ? 0 : Number(minPrice);
                            const cleanedMax =
                                maxPrice === "" ? Number.MAX_SAFE_INTEGER : Number(maxPrice);

                            if (cleanedMin < 0 || cleanedMax < 0) {
                                alert("Price cannot be negative.");
                                return;
                            }

                            if (cleanedMin > cleanedMax) {
                                alert("Min price cannot be greater than max price.");
                                return;
                            }

                            // Trigger parent refresh
                            onApplyFilters();
                        }}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Selected Filters Summary */}
            {selectedOptions.length > 0 && (
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {selectedOptions.map(id => {
                            const option = options
                                .flatMap(c => c.optionValues || [])
                                .find(v => String(v.optionValueId) === String(id));
                            return option ? (
                                <span
                                    key={id}
                                    className="text-white bg-(--brand-primary) px-2 py-1 rounded text-xs flex items-center gap-1"
                                >
                                    {option.value}
                                    <button
                                        onClick={() => toggleOption(id)}
                                        className="hover:text-blue-200 font-bold"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ) : null;
                        })}
                    </div>
                    
                    <button
                        onClick={() => setSelectedOptions([])}
                        className="text-red-600 hover:underline font-semibold whitespace-nowrap cursor-pointer"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}

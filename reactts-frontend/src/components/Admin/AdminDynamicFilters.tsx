import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";
import type { Category } from "../../types/models/products/Category";
import type { ProductOption } from "../../types/models/products/ProductOption";

export interface DynamicFiltersProps {
    loadedCategories: Category[];
    onCategoryChange: (slug: string) => void;
    isLoading: boolean;
    loadedOptions: ProductOption[] | null | undefined;
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
    loadedCategories,
    onCategoryChange,
    isLoading,
    loadedOptions,
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

    const colors = siteConfig.colors;
    const [openDropdowns, setOpenDropdowns] = useState<Record<string | number, boolean>>({});

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
        <div className="bg-white p-3 rounded shadow border mb-4">

            <div className="flex flex-wrap gap-2 items-center">
                <select
                disabled={isLoading}
                    onChange={(e) => onCategoryChange(e.target.value ? e.target.value : "")}
                    className="text-xs font-semibold text-gray-700 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition"
                >
                    <option value="">Category</option>
                    {loadedCategories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                            {cat.name}
                        </option>
                    ))}
                </select>

{isLoading && (
  <div className="ml-2 text-xs text-gray-500">Loading options…</div>
)}

                {/* Dynamic Option Dropdowns*/}
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
                                        className="flex items-center justify-between border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition min-w-28"
                                    >
                                        <span className="font-semibold text-gray-700 truncate text-xs">
                                            {option.name}
                                            {selectedInCategory.length > 0 && (
                                                <span
                                                    className="ml-1 text-xs text-white px-1.5 py-0.5 rounded inline-block"
                                                    style={{ background: colors.primarycolor }}>
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
                                            className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 w-40"
                                            onMouseLeave={() => closeDropdown(option.optionId)}>
                                            <div className="p-2 max-h-48 overflow-y-auto">
                                                {option.optionValues.map(value => (
                                                    <label
                                                        key={value.optionValueId}
                                                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 transition cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedOptions.includes(value.optionValueId)}
                                                            onChange={() => toggleOption(value.optionValueId)}
                                                            className="w-3 h-3"
                                                        />
                                                        <span className="text-gray-700 text-xs">{value.value}</span>
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
                        <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Price:</label>
                        <input
                            placeholder="Min"
                            type="number"
                            className="border p-1.5 rounded w-24 text-xs"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span className="text-xs text-gray-500">-</span>
                        <input
                            placeholder="Max"
                            type="number"
                            className="border p-1.5 rounded w-24 text-xs"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        className="border p-1.5 rounded text-xs min-w-32 bg-white hover:bg-gray-50 transition"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="ascending">Low → High</option>
                        <option value="descending">High → Low</option>
                    </select>
                    
                {/* <button
                disabled={isLoading}
                    className="border p-1.5 rounded-lg text-xs min-w-32 bg-blue-600 text-white hover:bg-blue-700 transition"
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
                </button> */}
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
                                    className="text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                                    style={{ background: colors.primarycolor }}
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
                        className="text-red-600 hover:underline text-xs font-semibold whitespace-nowrap ml-4"
                    >
                        Clear all
                    </button>
                </div>
            )}
        </div>
    );
}

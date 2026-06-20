import type { UserProductFiltersReturn } from "../../../hooks/products/useProductFilters";

interface ProductAttributesTabProps {
    mode: string;
    filters: UserProductFiltersReturn;
    selectedOptionValueIds: number[];
    handleOptionChange: (id: number) => void;
    submittingProduct: boolean;
    submitProduct: () => void;
}

export default function ProductAttributesTab({
    mode,
    filters,
    selectedOptionValueIds,
    handleOptionChange,
    submittingProduct,
    submitProduct,
}: ProductAttributesTabProps) {
    return (
        <div className="space-y-4">
            <label className="text-2xl font-bold text-black">Product Attributes</label>

            {filters.filtersLoading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                    <p className="text-gray-500 text-sm mt-2">Loading attributes...</p>
                </div>
            ) : filters.filters.length === 0 ? (
                <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
                    <p className="font-semibold">No attributes available for this category.</p>
                    <p className="text-sm mt-1">You can still save the product and add variants manually.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filters.filters.map((option) => (
                        <div key={option.optionId}>
                            <h4 className="text-sm font-semibold text-black mb-3">
                                {option.optionName}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {option.optionValues?.map((value) => (
                                    <label
                                        key={value.id}
                                        className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition"
                                        style={{
                                            borderColor: selectedOptionValueIds.includes(value.id)
                                                ? "blue"
                                                : "black",
                                            backgroundColor: selectedOptionValueIds.includes(value.id)
                                                ? "#eff6ff"
                                                : "white",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedOptionValueIds.includes(value.id)}
                                            onChange={() => handleOptionChange(value.id)}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                        <span className="text-sm font-medium text-black">
                                            {value.value}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={submitProduct}
                    disabled={submittingProduct}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submittingProduct
                        ? "Saving..."
                        : mode === "edit"
                            ? "Update Product"
                            : "Create Product"}
                </button>
            </div>
        </div>
    );
}
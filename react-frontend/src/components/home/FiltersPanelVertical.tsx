import type { ProductOption } from "../../types/models/products/Product";
import type { ProductOptionValue } from "../../types/models/products/Product";

interface Props {
    selectedCategory: string;
    options: ProductOption[];
    loading: boolean;
    onLeave: () => void;
    onFilterClick: (category: string, optionId: string | number) => void;
    onViewAll: () => void;
}

export default function FiltersPanelVertical({
    selectedCategory,
    options,
    loading,
    onLeave,
    onFilterClick,
    onViewAll
}: Props) {

    return (
        <div
            onMouseLeave={onLeave}
            className="w-full h-full p-8 rounded-2xl flex flex-col"
        >
            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : options?.length > 0 ? (
                <>
                    <div
                        className="grid gap-6"
                        style={{
                            gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
                        }}
                    >
                        {options.map((option) => (
                            <div key={option.optionId}>
                                <h4 className="font-bold text-sm mb-2">
                                    {option.optionName}
                                </h4>

                                <div className="flex flex-col gap-1">
                                    {option.optionValues.map((v: ProductOptionValue) => (
                                        <button
                                            key={v.optionValueId}
                                            onClick={() =>
                                                onFilterClick(selectedCategory, v.optionValueId)
                                            }
                                            className="text-sm text-left cursor-pointer hover:text-(--brand-primary) hover:font-bold"
                                        >
                                            {v.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={onViewAll}
                        className="w-full mt-auto py-2 text-white bg-(--brand-primary) rounded-lg cursor-pointer"
                    >
                        View All
                    </button>
                </>
            ) : (
                <div className="text-center py-12">
                    No filters available
                </div>
            )}
        </div>
    );
}
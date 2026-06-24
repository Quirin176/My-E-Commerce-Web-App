import { SquarePen, X } from "lucide-react";
import type { ProductOption } from "../../../types/models/products/Product";

interface AttributeValuesSectionProps {
    selectedOption: ProductOption | undefined;
    onEditValue: (optionValueId: number, value: string) => void;
    onDeleteValue: (optionValueId: number, value: string) => void;
}

export default function AttributeValuesSection({
    selectedOption,
    onEditValue,
    onDeleteValue,
}: AttributeValuesSectionProps) {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold pb-4">
                {selectedOption ? `${selectedOption.optionName} Values` : "Attribute Values"}
            </h2>

            {!selectedOption ? (
                <div className="rounded-xl bg-(--bg-surface) border-2 border-(--brand-primary) p-4">
                    Select an attribute
                </div>
            ) : selectedOption.optionValues.length === 0 ? (
                <div className="rounded-xl bg-(--bg-surface) p-4">No values found</div>
            ) : (
                selectedOption.optionValues.map((value) => (
                    <div
                        key={value.optionValueId}
                        className="flex justify-between items-center rounded-xl border-2 font-semibold
                            text-(--brand-primary) border-(--brand-primary) bg-(--bg-surface) hover:border-(--text-primary)
                            px-4 py-2 cursor-pointer"
                        onClick={() => onEditValue(value.optionValueId, value.value)}
                    >
                        <span>{value.value}</span>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditValue(value.optionValueId, value.value);
                                }}
                                className="rounded-xl border-2 p-1 cursor-pointer"
                                title="Update Attribute Value"
                            >
                                <SquarePen size={18} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteValue(value.optionValueId, value.value);
                                }}
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
    );
}

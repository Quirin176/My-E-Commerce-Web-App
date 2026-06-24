import { Plus, SquarePen, X } from "lucide-react";
import type { ProductOption } from "../../../types/models/products/Product";

interface AttributesSectionProps {
    loadedOption: ProductOption[];
    selectedOptionId: number;
    onSelectOption: (optionId: number) => void;
    onAddValue: (optionId: number) => void;
    onEditOption: (option: ProductOption) => void;
    onDeleteOption: (option: ProductOption) => void;
}

export default function AttributesSection({
    loadedOption,
    selectedOptionId,
    onSelectOption,
    onAddValue,
    onEditOption,
    onDeleteOption,
}: AttributesSectionProps) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold pb-4">Attributes</h2>

            <div className="flex flex-col gap-4">
                {loadedOption.map((option) => (
                    <div
                        key={option.optionId}
                        className={`h-16 flex justify-between items-center rounded-xl bg-(--bg-surface)
                            border-2 px-4 py-2 group transition
                            ${selectedOptionId === option.optionId ?
                                "text-white bg-(--brand-primary) border-white" : "text-(--brand-primary) border-(--brand-primary) hover:border-(--text-primary)"
                            }`}
                        onClick={() => onSelectOption(option.optionId)}
                    >
                        {/* OPTION NAME */}
                        <div className="flex-1 cursor-pointer">
                            <span className="font-bold">{option.optionName}</span>
                        </div>

                        {/* BUTTONS */}
                        <div
                            className="flex items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => onAddValue(option.optionId)}
                                className="rounded-xl border-2 p-1 cursor-pointer"
                                title="Add Attribute Value"
                            >
                                <Plus size={18} />
                            </button>

                            <button
                                onClick={() => onEditOption(option)}
                                className="rounded-xl border-2 p-1 cursor-pointer"
                                title="Update Attribute"
                            >
                                <SquarePen size={18} />
                            </button>

                            <button
                                onClick={() => onDeleteOption(option)}
                                className="rounded-xl border-2 p-1 cursor-pointer"
                                title="Remove Attribute"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

import type { ProductOptionPayload } from "../../types/models/products/Product";

interface ProductSpecificationsProps {
    options: ProductOptionPayload[] | undefined;
}

export default function ProductSpecifications({options}: ProductSpecificationsProps) {

    return (
        <>
            {/* Product Options/Attributes */}
            {options && options.length > 0 && (
                <div className="mb-6 p-4 bg-(--bg-muted) rounded-lg border-l-4 border-blue-600">
                    <h3 className="text-xl font-bold mb-4">Specifications</h3>
                    <div className="space-y-2">
                        {options.map((opt, index) => (
                            <div key={index}>
                                <span className="font-semibold">{opt.optionName}:</span>
                                <span className="ml-2">{opt.optionValues.map((v) => v.value).join(", ")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
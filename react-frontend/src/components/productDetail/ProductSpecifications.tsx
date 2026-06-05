import type { ProductOptionPayload } from "../../types/models/products/Product";

interface ProductSpecificationsProps {
    options: ProductOptionPayload[] | undefined;
}

export default function ProductSpecifications({options}: ProductSpecificationsProps) {

    return (
        <>
            {/* Product Options/Attributes */}
            {options && options.length > 0 && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg border-l-4 border-blue-600">
                    <h3 className="font-semibold text-gray-800 mb-3">Specifications</h3>
                    <div className="space-y-2">
                        {options.map((opt, index) => (
                            <div key={index} className="text-gray-700">
                                <span className="font-semibold text-gray-800">{opt.optionName}:</span>
                                <span className="ml-2 text-gray-600">{opt.optionValues.map((v) => v.value).join(", ")}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
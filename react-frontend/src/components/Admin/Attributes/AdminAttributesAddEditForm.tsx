import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Layers, List, Tag, X } from "lucide-react";
import { categoryApi } from "../../../api/products/categoryApi";
import { productoptionApi } from "../../../api/products/productoptionApi";
import { productoptionvalueApi } from "../../../api/products/productoptionvalueApi";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalMode = "add-category" | "edit-category" | "add-option" | "edit-option" | "add-value" | "edit-value";

export interface ModalConfig {
    mode: ModalMode;
    title: string;
    label: string;
    placeholder: string;
    initialValue: string;
    categoryId?: number;
    optionId?: number;
    optionValueId?: number;
}

// ─── Reusable Modal ───────────────────────────────────────────────────────────

interface AttributeModalProps {
    config: ModalConfig | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AdminAttributesModal({ config, onClose, onSuccess }: AttributeModalProps) {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);

    // Sync initial value when config changes
    useEffect(() => {
        setValue(config?.initialValue ?? "");
    }, [config]);

    if (!config) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) {
            toast.error("Please enter a value");
            return;
        }

        setLoading(true);
        try {
            switch (config.mode) {
                case "add-category":
                    await categoryApi.createCategory({ name: trimmed, slug: trimmed.toLowerCase().replace(/\s+/g, "-") });
                    toast.success("Category created!");
                    break;

                case "add-option":
                    await productoptionApi.createProductOption(config.categoryId!, trimmed);
                    toast.success("Attribute created!");
                    break;

                case "edit-option":
                    // Uncomment when API is ready:
                    // await productoptionApi.updateProductOption(config.optionId!, trimmed);
                    toast.success("Attribute updated!");
                    break;

                case "add-value":
                    await productoptionvalueApi.createOptionValue(config.optionId!, trimmed);
                    toast.success("Value created!");
                    break;

                case "edit-value":
                    await productoptionvalueApi.updateOptionValue(config.optionValueId!, trimmed);
                    toast.success("Value updated!");
                    break;

                default:
                    break;
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const modeIcon = {
        "add-category": <Tag size={20} className="text-blue-500" />,
        "edit-category": <Tag size={20} className="text-blue-500" />,
        "add-option": <Layers size={20} className="text-purple-500" />,
        "edit-option": <Layers size={20} className="text-purple-500" />,
        "add-value": <List size={20} className="text-green-500" />,
        "edit-value": <List size={20} className="text-green-500" />,
    }[config.mode];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <div className="flex items-center gap-2">
                            {modeIcon}
                            <h2 className="text-lg font-bold text-gray-800">{config.title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {config.label}
                            </label>
                            <input
                                autoFocus
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={config.placeholder}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition text-gray-800"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? "Saving..." : config.mode.startsWith("add") ? "Create" : "Update"}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

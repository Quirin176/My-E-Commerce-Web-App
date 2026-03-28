// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
 import { useState } from "react";
 import { toast } from "react-hot-toast";

export interface DeleteConfig {
    label: string;
    onConfirm: () => Promise<void>;
}
 
export default function AdminAttributesDeleteModal({ config, onClose }: { config: DeleteConfig | null; onClose: () => void }) {
    const [loading, setLoading] = useState(false);
 
    if (!config) return null;
 
    const handleConfirm = async () => {
        setLoading(true);
        try {
            await config.onConfirm();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h2>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete <strong>"{config.label}"</strong>? This cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

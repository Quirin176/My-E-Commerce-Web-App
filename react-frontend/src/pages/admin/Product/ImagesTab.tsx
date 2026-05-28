import { useNavigate } from "react-router-dom";
import { AlertCircle, Plus, X } from "lucide-react";
import type { ImagePayload } from "../../../api/admin/adminProductsApi";

interface ImagesTabProps {
    productId: number | null;
    images: ImagePayload[];
    imageInput: string;
    setImageInput: (v: string) => void;
    addImage: () => void;
    removeImage: (index: number) => void;
    submittingImages: boolean;
    onSave: () => void;
}

export default function ImagesTab(props: ImagesTabProps) {
    const {
        productId,
        images,
        imageInput,
        setImageInput,
        addImage,
        removeImage,
        submittingImages,
        onSave
    } = props;

    const navigate = useNavigate();

    return (
        <div className="space-y-4">
            <label className="text-2xl font-bold text-black">Product Images</label>

            {/* Info banner when product not yet saved */}
            {!productId && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-800">
                    <AlertCircle size={20} className="shrink-0" />
                    <div>
                        <p className="font-semibold text-sm">Product not saved yet</p>
                        <p className="text-xs mt-0.5">
                            Go to the <strong>Product</strong> tab and click <strong>Create Product</strong> first,
                            then come back here to add images.
                        </p>
                    </div>
                </div>
            )}

            {productId && (
                <>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Add Image URL
                    </label>
                    <div className="flex gap-2">
                        <input
                            value={imageInput}
                            onChange={(e) => setImageInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addImage();
                                }
                            }}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 transition bg-white flex-1"
                            disabled={!productId}
                        />
                        <button
                            type="button"
                            onClick={addImage}
                            disabled={!productId}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shrink-0 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus size={14} /> Add
                        </button>
                    </div>

                    {images.length > 0 && (
                        <div className="flex flex-col gap-2 mt-3">
                            {images.map((img, idx) => (
                                <div className="flex flex-row gap-2">
                                    <div key={idx} className="relative group w-20 h-20">
                                        <p
                                            className="absolute top-0 left-0 w-5 h-5 bg-gray-600 text-white rounded text-xs flex items-center justify-center"
                                        >
                                            {img.displayOrder}
                                        </p>
                                        <img
                                            src={img.imageUrl}
                                            alt={`Product image ${idx + 1}`}
                                            className={`w-full h-full object-cover rounded border-2 ${img.isMain ? "border-blue-500" : "border-gray-200"
                                                }`}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    "https://via.placeholder.com/80?text=Error";
                                            }}
                                        />
                                        {img.isMain && (
                                            <span className="absolute bottom-0 left-0 right-0 text-center text-white text-[9px] bg-blue-500 rounded-b">
                                                Main
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>

                                    <input
                                        value={img.imageUrl}
                                        onChange={(e) => setImageInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addImage();
                                            }
                                        }}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 transition bg-white flex-1"
                                        disabled={!productId}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {images.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {images.length} image{images.length !== 1 ? "s" : ""} queued — first image will be set as main.
                        </p>
                    )}
                </>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => navigate("/admin/products")}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                >
                    Done / Skip
                </button>
                <button
                    type="button"
                    onClick={() => onSave()}
                    disabled={submittingImages || !productId || images.length === 0}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submittingImages ? "Saving..." : "Save Product Images"}
                </button>
            </div>
        </div>
    );
}
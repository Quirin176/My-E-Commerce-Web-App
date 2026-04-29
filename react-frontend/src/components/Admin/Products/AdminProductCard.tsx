import { Edit2, Trash2 } from "lucide-react";
import type { Product } from "../../../types/models/products/Product";

interface AdminProductCardProps {
  product: Product;
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onView: (product: Product) => void;
  onDelete: (id: number | string) => void;
}

export default function AdminProductCard({
  product,
  isLoading,
  onEdit,
  onView,
  onDelete,
}: AdminProductCardProps) {

  return (
    <div
      onClick={() => onView(product)}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <img
            src={
              product.imageUrl ||
              product.images[0] ||
              "https://via.placeholder.com/200x150?text=No+Image"
            }
            alt={product.name}
            className="w-20 h-20 object-cover rounded shrink-0"
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category?.name}</p>
            </div>
            <p className="text-sm text-gray-500">{product.slug}</p>
          </div>
        </div>

        <div className="flex flex-row gap-20">
          <span className="text-lg font-bold text-blue-600">
            {product.price?.toLocaleString("vi-VN")} VND
          </span>

          <div className="flex flex-row gap-2">
            <button
              title="Edit Product"
              disabled={isLoading}
              className="p-2 border rounded cursor-pointer text-blue-600 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={(e) => { e.stopPropagation(); onEdit(product); }}
            >
              <Edit2 size={18} />
            </button>

            <button
              title="Delete Product"
              disabled={isLoading}
              className="p-2 border rounded cursor-pointer text-red-600 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

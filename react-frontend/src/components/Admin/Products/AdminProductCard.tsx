import { Link } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import type { Product } from "../../../types/models/products/Product";

interface AdminProductCardProps {
  product: Product;
  selected?: boolean;
  onSelect?: (id: number | string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number | string, name: string) => void;
}

export default function AdminProductCard({
  product,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
}: AdminProductCardProps) {

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <label
          title={`Select ${product.name}`}
          className="inline-flex items-center"
        >
          <input
            type="checkbox"
            checked={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onSelect?.(product.id)}
            aria-label={`Select ${product.name}`}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          />
        </label>

        <div className="flex flex-row items-center gap-2">
          <img
            src={product.thumbnailUrl || "https://via.placeholder.com/200x150?text=No+Image"}
            alt={product.name}
            className="w-20 h-20 object-cover rounded shrink-0"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <Link
              className="font-bold text-lg hover:underline cursor-pointer"
              to={`/admin/products/${product.id}/edit`}
            >
              {product.name}
            </Link>

            <p className="text-sm">{product.category?.name}</p>
          </div>

          <p className="text-sm">{product.slug}</p>
        </div>
      </div>

      <div className="flex flex-row gap-20">
        <span className="text-lg font-bold text-blue-600">
          {product.basePrice?.toLocaleString("vi-VN")} VND
        </span>

        <div className="flex flex-row gap-2">
          <button
            title="Edit Product"
            // disabled={isLoading}
            className="p-2 border rounded cursor-pointer text-blue-600 hover:bg-(--bg-muted) disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => { e.stopPropagation(); onEdit(product); }}
          >
            <Edit2 size={18} />
          </button>

          <button
            title="Delete Product"
            // disabled={isLoading}
            className="p-2 border rounded cursor-pointer text-red-600 hover:bg-(--bg-muted) disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => { e.stopPropagation(); onDelete(product.id, product.name); }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
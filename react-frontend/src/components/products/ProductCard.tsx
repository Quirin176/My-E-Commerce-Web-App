import { Link } from "react-router-dom";
import type { Product } from "../../types/models/products/Product";

export default function ProductCard({ product }: { product: Product }) {

  return (
    <div className="border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-(--bg-surface) flex flex-col">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="flex justify-center pt-2">
          <img
            src={
              product.thumbnailUrl ||
              "https://via.placeholder.com/200x150?text=No+Image"
            }
            alt={product.name}
            className="w-48 h-48 object-cover rounded-md"
          />
        </div>

        <div className="p-2 flex flex-col">
          <div className="h-12 overflow-hidden">
            <h3 className="font-bold leading-6 text-center text-(--brand-primary)">
              {product.name}
            </h3>
          </div>

          <div className="h-40 mt-2 overflow-y-auto rounded-xl p-2 text-sm text-left bg-(--bg-muted)">
            {product.options && product.options.length > 0 ? (
              product.options.map((opt) => (
                <p key={opt.optionId}>
                  <strong>{opt.optionName}:</strong>{" "}
                  {opt.optionValues?.join(", ")}
                </p>
              ))
            ) : (
              <p>No option data available</p>
            )}
          </div>
        </div>
      </Link>

      <p className="text-end font-bold p-2 mb-3 text-(--price)">
        {product.basePrice?.toLocaleString() || "N/A"} VND
      </p>
    </div>
  );
}
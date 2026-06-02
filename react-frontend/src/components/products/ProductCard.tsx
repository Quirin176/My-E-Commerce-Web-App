import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { useCart } from "../../hooks/cart/useCart";
import type { Product } from "../../types/models/products/Product";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAdd = () => {
    if (!user || user.role === "Admin") {
      toast.error(
        "You must be logged in as a customer to add items to the cart."
      );
      return;
    }

    const item = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.basePrice,
      image: product.thumbnailUrl || "https://via.placeholder.com/200x150?text=No+Image",
    };

    try {
      addToCart(item, 1);
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error(`Failed to add ${item.name} to cart.`);
    }
  };

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
                <p key={opt.id}>
                  <strong>{opt.optionName}:</strong>{" "}
                  {opt.values}
                </p>
              ))
            ) : (
              <p>No option data available</p>
            )}
          </div>
        </div>
      </Link>

      <div className="p-2">
        <p className="text-end font-bold mb-3 border-t border-b border-gray-100 text-(--price)">
          {product.basePrice?.toLocaleString() || "N/A"} VND
        </p>
        <button
          onClick={handleAdd}
          className="w-full font-semibold text-white bg-(--brand-primary) py-3 rounded-lg hover:brightness-75 transition duration-150 transform hover:scale-[1.01]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
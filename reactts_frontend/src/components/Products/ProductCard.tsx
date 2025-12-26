import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config/siteConfig";
import { useAuth } from "../../hooks/useAuth";

export default function ProductCard({ product }) {
    const colors = siteConfig.colors;
    // const { addToCart } = useCart();
    const { user } = useAuth();

    const handleAdd = () => {

    };

    return (
    <div className="border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="flex justify-center pt-2">
          <img
            src={
              product.imageUrl ||
              product.image ||
              "https://via.placeholder.com/200x150?text=No+Image"
            }
            alt={product.name}
            className="w-48 h-48 object-cover rounded-md"
          />
        </div>

        <div className="p-2 flex flex-col">
          <div className="h-12 overflow-hidden">
            <h3
              className="font-bold text-base leading-6 text-center"
              style={{ color: colors.primarycolor }}
            >
              {product.name}
            </h3>
          </div>

          <div className="h-40 mt-2 overflow-y-auto bg-gray-100 rounded-xl p-2 text-sm text-left">
            {product.options && product.options.length > 0 ? (
              product.options.map((opt, index) => (
                // console.log("Product option:", opt) ||
                <p key={index} className="text-gray-700">
                  <strong>{opt.optionName}:</strong> {opt.value}
                </p>
              ))
            ) : (
              <p>No option data available</p>
            )}
          </div>
        </div>
      </Link>

      <div className="p-2">
        <p
          className="text-end text-lg font-bold mb-3 border-t border-b border-gray-100"
          style={{ color: colors.primarycolor }}
        >
          {product.price?.toLocaleString() || "N/A"} VND
        </p>
        <button
          onClick={handleAdd}
          className="w-full font-semibold text-white py-3 rounded-lg hover:brightness-75 transition duration-150 transform hover:scale-[1.01]"
          style={{ background: colors.primarycolor }}
        >
          Add to Cart
        </button>
      </div>
    </div>
    );
}
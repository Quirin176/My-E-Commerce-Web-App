interface AddToCartSectionProps {
    price: number;
    stock: number;
    onAddToCart: () => void;
}

export default function AddToCartSection({ price, stock, onAddToCart }: AddToCartSectionProps) {

    return (
        <>
            <div className="mt-6">

                <div className="text-3xl font-bold text-blue-600">
                    {price.toLocaleString()} VND
                </div>

                <div className="text-sm text-gray-500 mt-1">
                    {stock} items available
                </div>

            </div>

            <button
                onClick={onAddToCart}
                disabled={stock <= 0}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-400"
            >
                {stock > 0 ? "Add To Cart" : "Out Of Stock"}
            </button>
        </>
    );
}
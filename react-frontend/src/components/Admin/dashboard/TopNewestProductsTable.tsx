import { useNavigate } from "react-router-dom";
import type { Product } from "../../../types/models/products/Product";

interface TopProductsTableProp {
    topProducts: Product[] | null;
}

export default function TopNewestProductsTable({ topProducts }: TopProductsTableProp) {
    const navigate = useNavigate();

    if (!topProducts) return null;

    const handleClick = (productId: number) => {
        navigate(`/admin/products/${productId}/edit`)
    }

    return (
        <div className="overflow-x-auto">

            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="py-2">Product</th>
                        <th className="py-2">Date Added</th>
                    </tr>
                </thead>

                <tbody>
                    {topProducts.map(product => (
                        <tr key={product.id} className="border-b last:border-none">
                            <td
                                className="py-2 font-medium hover:text-blue-600 cursor-pointer"
                                onClick={() => handleClick(Number(product.id))}
                            >{product.name}</td>
                            <td>{product.createdAt}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}
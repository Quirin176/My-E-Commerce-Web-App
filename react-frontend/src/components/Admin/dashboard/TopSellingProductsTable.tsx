import { useNavigate } from "react-router-dom";
import type { TopSellingProduct } from "../../../types/dto/AdminDashboardDTOs";

interface TopProductsTableProp {
  topProducts: TopSellingProduct[] | null;
}

export default function TopSellingProductsTable({ topProducts }: TopProductsTableProp) {
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
            <th className="py-2">Units Sold</th>
            <th className="py-2">Revenue</th>
          </tr>
        </thead>

        <tbody>
          {topProducts.map(product => (
            <tr key={product.productId} className="border-b last:border-none">
              <td
                className="py-2 font-medium hover:text-blue-600 cursor-pointer"
                onClick={() => handleClick(product.productId)}
              >{product.productName}</td>
              <td>{product.totalQuantity}</td>
              <td>{product.totalRevenue.toLocaleString("vi-VN")} VND</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
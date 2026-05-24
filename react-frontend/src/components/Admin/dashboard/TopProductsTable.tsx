import type { TopProduct } from "../../../types/dto/AdminDashboardDTOs";

interface TopProductsTableProp {
  topProducts: TopProduct[] | null;
}

export default function TopProductsTable({ topProducts }: TopProductsTableProp) {
  if (!topProducts) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-2">Product</th>
            <th className="py-2">Units Sold</th>
            <th className="py-2">Revenue</th>
          </tr>
        </thead>

        <tbody>
          {topProducts.map(product => (
            <tr key={product.productId} className="border-b last:border-none">
              <td className="py-2 font-medium">{product.productName}</td>
              <td>{product.totalQuantity}</td>
              <td>{product.totalRevenue.toLocaleString("vi-VN")} VND</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
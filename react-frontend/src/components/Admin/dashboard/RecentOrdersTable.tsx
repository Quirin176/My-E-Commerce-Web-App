import type { RecentOrder } from "../../../types/dto/AdminDashboardDTOs";

interface RecentOrdersTableProp {
  orders: RecentOrder[] | null,
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProp) {
  if (!orders) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-blue-200">
            <th className="py-2">Order ID</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Total</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {orders.map(order => (
            <tr key={order.id} className="border-b-2 border-gray-200 last:border-none">
              <td className="py-2">{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.totalAmount.toLocaleString("vi-VN")} VND</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-sm
                  ${order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}